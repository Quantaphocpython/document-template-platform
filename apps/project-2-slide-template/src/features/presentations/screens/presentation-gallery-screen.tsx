'use client';

import { BookOpen, FolderX, Presentation, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button, ButtonSize, ButtonVariant, Input, Skeleton } from 'ui';
import { CategoryFilter } from '../components/category-filter';
import { PresentationCard } from '../components/presentation-card';
import { SlideDeckModal } from '../components/slide-deck-modal';
import { PresentationCreatedModal } from '../components/presentation-created-modal';
import { usePresentationGallery } from '../hooks/use-presentation-gallery';

export const PresentationGalleryScreen: React.FC = () => {
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
    createdPresentation,
    setCreatedPresentation,
    creatingTemplateId,
    categoryCounts,
    handleUseTemplate,
    handleResetFilters,
  } = usePresentationGallery();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sản phẩm 2: Thư viện mẫu trình chiếu PowerPoint
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Thư Viện Mẫu Bài Thuyết Trình
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Khám phá các bộ slide PowerPoint chuyên nghiệp tỉ lệ 16:9 Cinema. Xem trước toàn bộ slide trong deck, nhân bản độc lập và tải tệp .pptx tương thích Microsoft PowerPoint.
          </p>
        </div>

        {/* Global Stats & API Docs Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <Presentation className="w-4 h-4 text-indigo-600" />
            <span>Tổng số bộ slide:</span>
            <strong className="text-sm font-bold text-slate-900 font-mono">
              {templates.length}
            </strong>
          </div>

          <Link href="/api-docs">
            <Button variant={ButtonVariant.OUTLINE} size={ButtonSize.SM}>
              <BookOpen className="w-4 h-4 mr-1.5 text-indigo-600" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid List of Presentation Templates */}
      {isLoading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
            >
              <Skeleton className="w-full aspect-16/9 rounded-xl" />
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
        /* Actual Presentation Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <PresentationCard
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
            Không tìm thấy bộ slide nào
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

      {/* Slide Deck Preview Modal */}
      <SlideDeckModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
        isCreating={previewTemplate ? creatingTemplateId === previewTemplate.id : false}
      />

      {/* Presentation Created & Download Modal */}
      <PresentationCreatedModal
        presentation={createdPresentation}
        isOpen={!!createdPresentation}
        onClose={() => setCreatedPresentation(null)}
      />
    </div>
  );
};

