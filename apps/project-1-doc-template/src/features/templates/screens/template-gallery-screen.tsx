'use client';

import React from 'react';
import { Search, X, FolderX, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sản phẩm 1: Thư viện mẫu tài liệu văn bản
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Thư Viện Mẫu Văn Bản
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Tìm kiếm, xem trước và lựa chọn biểu mẫu văn phòng chuyên nghiệp. Tự do tùy biến trên trình soạn thảo chuẩn A4 và xuất file Microsoft Word (.docx).
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Tổng số mẫu khả dụng:</span>
            <strong className="text-sm font-bold text-slate-900 font-mono">
              {templates.length}
            </strong>
          </div>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid List of Templates */}
      {isLoading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
            >
              <Skeleton className="w-full aspect-16/10 rounded-xl" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : templates.length > 0 ? (
        /* Actual Template Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onPreview={(item) => setPreviewTemplate(item)}
              onUseTemplate={handleUseTemplate}
              isCreating={creatingTemplateId === tpl.id}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <FolderX className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Không tìm thấy biểu mẫu nào
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            Không có kết quả nào khớp với từ khóa &quot;{searchQuery}&quot; hoặc danh mục đã chọn. Vui lòng thử tìm với từ khóa khác.
          </p>
          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.SM}
            onClick={handleResetFilters}
          >
            Xóa bộ lọc tìm kiếm
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
        isCreating={previewTemplate ? creatingTemplateId === previewTemplate.id : false}
      />
    </div>
  );
};

