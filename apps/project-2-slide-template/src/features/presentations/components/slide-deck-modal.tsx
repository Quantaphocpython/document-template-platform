'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { SlideTemplate } from '@/types';
import { Badge, BadgeVariant, Button, ButtonSize, ButtonVariant, cn, Modal, PortalProps } from 'ui';

export enum SlideNavigationKey {
  ARROW_RIGHT = 'ArrowRight',
  ARROW_LEFT = 'ArrowLeft',
  ESCAPE = 'Escape',
}

export interface SlideDeckModalData {
  template: SlideTemplate;
  onUseTemplate: (template: SlideTemplate) => void;
  isCreating?: boolean;
}

export interface SlideDeckModalProps extends PortalProps<SlideDeckModalData> {
  template?: SlideTemplate | null;
  isOpen?: boolean;
  onClose?: () => void;
  onUseTemplate?: (template: SlideTemplate) => void;
  isCreating?: boolean;
}

export const SlideDeckModal: React.FC<SlideDeckModalProps> = ({
  template: propTemplate,
  isOpen: propIsOpen,
  onClose: propOnClose,
  onUseTemplate: propOnUseTemplate,
  isCreating: propIsCreating,
  data,
  onDismiss,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const template = data?.template || propTemplate;
  const isOpen = propIsOpen ?? true;
  const onClose = onDismiss || propOnClose || (() => {});
  const onUseTemplate = data?.onUseTemplate || propOnUseTemplate || (() => {});
  const isCreating = data?.isCreating ?? propIsCreating ?? false;

  if (!template) return null;

  const currentSlide = template.slides[activeSlideIndex] || template.slides[0];

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : template.slides.length - 1));
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev < template.slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.title}
      description={`Xem trước chi tiết toàn bộ ${template.totalSlides} trang slide tỉ lệ 16:9 trước khi tạo bài thuyết trình`}
      maxWidth="6xl"
    >
      <div className="flex flex-col gap-5">
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <Badge variant={BadgeVariant.INDIGO}>{template.categoryName}</Badge>
            <span className="text-slate-400 font-mono">Định dạng: Microsoft PowerPoint (.pptx)</span>
            <span className="text-slate-400 font-medium">• 16:9 HD</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.MD}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Tạo bản trình chiếu mới từ bộ mẫu
            </Button>
          </div>
        </div>

        {/* 16:9 Cinema Screen Player */}
        <div className="relative w-full aspect-16/9 bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group">
          <Image
            src={currentSlide.previewImageUrl}
            alt={currentSlide.title}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
            aria-label="Slide trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
            aria-label="Slide tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicator Badge */}
          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
            Slide {activeSlideIndex + 1} / {template.slides.length}
          </div>
        </div>

        {/* Current Slide Info */}
        <div className="px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400">Trang {currentSlide.slideNumber}:</span>
            <h4 className="text-sm font-bold text-white">{currentSlide.title}</h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">{currentSlide.description}</p>
        </div>

        {/* Filmstrip Carousel */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2 text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Danh sách slide (Filmstrip Bar)
            </span>
            <span>Nhấp vào từng slide để chuyển nhanh</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {template.slides.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={cn(
                    'relative shrink-0 w-36 aspect-16/9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer group/thumb shadow-sm',
                    isActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-102'
                      : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                  )}
                >
                  <Image
                    src={slide.previewImageUrl}
                    alt={slide.title}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-slate-950/80 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm">
                    #{slide.slideNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immutability Guarantee Note */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 text-xs">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Bảo vệ mẫu gốc (Template Immutability):</strong> Khi bạn chọn &ldquo;Tạo bản trình chiếu&rdquo;, hệ thống sẽ tự động nhân bản một tệp PowerPoint riêng biệt độc lập. Bộ slide gốc của hệ thống sẽ luôn được bảo toàn 100%.
          </span>
        </div>
      </div>
    </Modal>
  );
};

