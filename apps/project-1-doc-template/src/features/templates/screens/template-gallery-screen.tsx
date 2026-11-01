'use client';

import { BookOpen, CheckCircle2, FileText, FolderX, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button, ButtonSize, ButtonVariant, Input, Skeleton } from 'ui';
import { CategoryFilter } from '../components/category-filter';
import { TemplateCard } from '../components/template-card';
import { TemplatePreviewModal } from '../components/template-preview-modal';
import { useTemplateGallery } from '../hooks/use-template-gallery';

export const TemplateGalleryScreen: React.FC = () => {
  const {
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
  } = useTemplateGallery();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-foreground text-background px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/25 bg-accent text-accent-foreground text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Sản phẩm 1: Thư viện mẫu tài liệu văn bản
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Thư Viện Mẫu Văn Bản
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Tìm kiếm, xem trước và lựa chọn biểu mẫu văn phòng chuyên nghiệp. Tự do tùy biến trên trình soạn thảo chuẩn A4 và xuất file Microsoft Word (.docx).
          </p>
        </div>

        {/* Global Stats & API Docs Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border text-xs text-foreground/80 shadow-xs">
            <FileText className="w-4 h-4 text-primary" />
            <span>Tổng số mẫu:</span>
            <strong className="text-xs font-bold text-foreground font-mono">
              {templates.length}
            </strong>
          </div>

          <Link href="/api-docs">
            <Button variant={ButtonVariant.OUTLINE} size={ButtonSize.SM}>
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-foreground/70" />
              Swagger API Docs
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex-1 min-w-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Search Input with Debounce */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm theo tên, thẻ hoặc nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Template Grid or Skeleton Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-4 space-y-4"
            >
              <Skeleton className="w-full aspect-16/10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={setPreviewTemplate}
              onUseTemplate={handleUseTemplate}
              isCreating={creatingTemplateId === template.id}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-border my-8">
          <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4">
            <FolderX className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Không tìm thấy mẫu phù hợp
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
            Không có biểu mẫu nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Thử tìm từ khóa khác hoặc xóa bộ lọc.
          </p>
          <div className="mt-4">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={handleResetFilters}
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
        isCreating={Boolean(
          creatingTemplateId && previewTemplate?.id === creatingTemplateId
        )}
      />
    </div>
  );
};
