import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { CategoryInfo, SlideCategory, SlideTemplate, UserPresentation } from '@/types';
import { templateApiService } from '@/services/templates/template-api.service';
import { presentationApiService } from '@/services/presentations/presentation-api.service';
import { confirmModal } from 'ui';

export function usePresentationGallery() {
  const [templates, setTemplates] = useState<SlideTemplate[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SlideCategory>(SlideCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounceValue(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [previewTemplate, setPreviewTemplate] = useState<SlideTemplate | null>(null);
  const [createdPresentation, setCreatedPresentation] = useState<UserPresentation | null>(null);
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

  // Fetch templates from API with debounced search query
  useEffect(() => {
    let ignore = false;
    const fetchTemplates = async () => {
      try {
        const data = await templateApiService.getTemplates({
          category: selectedCategory !== SlideCategory.ALL ? selectedCategory : undefined,
          search: debouncedSearch.trim() || undefined,
        });

        if (!ignore) {
          setTemplates(data.templates);
          setCategories(data.categories);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Lỗi khi tải danh sách bộ slide:', err);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchTemplates();
    return () => {
      ignore = true;
    };
  }, [selectedCategory, debouncedSearch]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { [SlideCategory.ALL]: templates.length };
    for (const t of templates) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    return counts;
  }, [templates]);

  // Handle using a template: Copy-on-Create API call for presentation PPTX
  const handleUseTemplate = useCallback(async (template: SlideTemplate) => {
    setCreatingTemplateId(template.id);
    try {
      const presentation = await presentationApiService.createFromTemplate({
        templateId: template.id,
      });

      setCreatedPresentation(presentation);
      setPreviewTemplate(null);
    } catch (error) {
      console.error('Lỗi nhân bản bài trình chiếu:', error);
      confirmModal.error('Lỗi nhân bản bài trình chiếu', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setCreatingTemplateId(null);
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory(SlideCategory.ALL);
    setSearchQuery('');
  }, []);

  return {
    templates,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    previewTemplate,
    setPreviewTemplate,
    createdPresentation,
    setCreatedPresentation,
    creatingTemplateId,
    categoryCounts,
    handleUseTemplate,
    handleResetFilters,
  };
}

