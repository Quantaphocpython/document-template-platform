import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounceValue } from 'usehooks-ts';
import { APP_ROUTES } from 'core';
import { CategoryInfo, Template, TemplateCategory } from '@/types';
import { templateApiService } from '@/services/templates/template-api.service';
import { documentApiService } from '@/services/documents/document-api.service';

export function useTemplateGallery() {
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>(TemplateCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounceValue(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchTemplates = async () => {
      try {
        const data = await templateApiService.getTemplates({
          category: selectedCategory !== TemplateCategory.ALL ? selectedCategory : undefined,
          search: debouncedSearch.trim() || undefined,
        });

        if (!ignore) {
          setTemplates(data.templates);
          setCategories(data.categories);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Lỗi khi tải danh sách mẫu:', err);
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { [TemplateCategory.ALL]: templates.length };
    for (const t of templates) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    return counts;
  }, [templates]);

  const handleUseTemplate = useCallback(async (template: Template) => {
    setCreatingTemplateId(template.id);
    try {
      const createdDoc = await documentApiService.createFromTemplate({
        templateId: template.id,
      });

      setToastMessage(`Đã tạo tài liệu mới từ mẫu "${template.title}" thành công!`);
      setTimeout(() => {
        router.push(APP_ROUTES.DOCUMENTS.DETAIL(createdDoc.id));
      }, 600);
    } catch (error) {
      console.error('Lỗi tạo tài liệu:', error);
      alert('Không thể kết nối đến máy chủ.');
      setCreatingTemplateId(null);
    }
  }, [router]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory(TemplateCategory.ALL);
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
    creatingTemplateId,
    toastMessage,
    categoryCounts,
    handleUseTemplate,
    handleResetFilters,
  };
}

