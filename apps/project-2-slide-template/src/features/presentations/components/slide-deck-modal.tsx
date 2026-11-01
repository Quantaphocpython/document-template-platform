'use client';

import { SlideTemplate } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  Layers,
  Maximize2,
  Minimize2,
  Paintbrush,
  Play,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  BadgeVariant,
  Button,
  ButtonSize,
  ButtonVariant,
  cn,
  Modal,
  PortalProps,
} from 'ui';
import { FabricSlideCanvas } from './fabric-slide-canvas';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOverview, setIsOverview] = useState(false);
  const [isCanvasMode, setIsCanvasMode] = useState(false);
  const playerWrapperRef = useRef<HTMLDivElement>(null);

  const template = data?.template || propTemplate;
  const isOpen = propIsOpen ?? true;
  const onClose = onDismiss || propOnClose || (() => {});
  const onUseTemplate = data?.onUseTemplate || propOnUseTemplate || (() => {});
  const isCreating = data?.isCreating ?? propIsCreating ?? false;

  const totalSlides = template?.slides.length ?? 0;

  const [prevTemplateId, setPrevTemplateId] = useState(template?.id);
  if (template?.id !== prevTemplateId) {
    setPrevTemplateId(template?.id);
    setActiveSlideIndex(0);
    setIsOverview(false);
  }

  const handlePrev = useCallback(() => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleNext = useCallback(() => {
    setActiveSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const handleSelectSlide = useCallback((idx: number) => {
    setActiveSlideIndex(idx);
    setIsOverview(false);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!playerWrapperRef.current) return;
    if (!document.fullscreenElement) {
      playerWrapperRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation: ArrowLeft, ArrowRight, Space, ESC, F
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        if (isOverview) {
          e.preventDefault();
          setIsOverview(false);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          handleToggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, isOverview, handleToggleFullscreen]);

  if (!template) return null;

  const currentSlide = template.slides[activeSlideIndex] || template.slides[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.title}
      description={`Trình chiếu tương tác 16:9 Cinema: Xem trước toàn bộ ${template.totalSlides} trang slide trước khi tạo bản sao độc lập`}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-muted/60 border border-border text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={BadgeVariant.INDIGO}>{template.categoryName}</Badge>
            <span className="text-muted-foreground font-mono">
              Định dạng: Microsoft PowerPoint (.pptx)
            </span>
            <span className="text-muted-foreground font-medium">
              • 16:9 Cinema HD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.SM}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tạo bản trình chiếu mới
            </Button>
          </div>
        </div>

        {/* 16:9 Cinema Screen Player with Responsive Aspect Ratio */}
        <div
          ref={playerWrapperRef}
          className={cn(
            'relative w-full aspect-video max-h-[48vh] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-border flex items-center justify-center select-none group mx-auto',
            isFullscreen && 'rounded-none border-0 max-h-none h-full w-full'
          )}
        >
          {/* Top Engine & Mode Overlay Controls */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-zinc-950/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 shadow-md">
              <Play className="w-3 h-3 text-primary fill-primary" />
              Slide {activeSlideIndex + 1} / {template.slides.length}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCanvasMode((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-1.5 bg-zinc-950/85 hover:bg-zinc-900 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 shadow-md transition-all cursor-pointer',
                isCanvasMode && 'bg-primary text-primary-foreground border-primary'
              )}
              title="Chuyển chế độ tương tác Canvas (Fabric.js 2D Engine)"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isCanvasMode ? 'Tắt Canvas' : 'Canvas Mode'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsOverview((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-1.5 bg-zinc-950/85 hover:bg-zinc-900 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 shadow-md transition-all cursor-pointer',
                isOverview && 'bg-primary/90 text-white border-primary'
              )}
              title="Xem toàn cảnh lưới slide (Overview grid / Phím ESC)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isOverview ? 'Đóng lưới' : 'Tổng quan'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="inline-flex items-center gap-1.5 bg-zinc-950/85 hover:bg-zinc-900 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 shadow-md transition-all cursor-pointer"
              title={
                isFullscreen ? 'Thu nhỏ (F)' : 'Toàn màn hình trình chiếu (F)'
              }
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-zinc-300" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
              )}
              <span className="hidden sm:inline">
                {isFullscreen ? 'Thoát' : 'Toàn màn hình'}
              </span>
            </button>
          </div>

          {/* Floating Left Navigation Arrow Button (Chuyển slide trước) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeSlideIndex === 0}
            className={cn(
              'absolute left-4 z-30 p-2.5 sm:p-3.5 rounded-full bg-zinc-950/80 hover:bg-primary text-white border border-white/20 shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer',
              activeSlideIndex === 0
                ? 'opacity-20 cursor-not-allowed hover:scale-100 hover:bg-zinc-950/80'
                : 'opacity-85 hover:opacity-100'
            )}
            title="Slide trước (Phím mũi tên trái ←)"
            aria-label="Slide trước"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Floating Right Navigation Arrow Button (Chuyển slide sau) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={activeSlideIndex === template.slides.length - 1}
            className={cn(
              'absolute right-4 z-30 p-2.5 sm:p-3.5 rounded-full bg-zinc-950/80 hover:bg-primary text-white border border-white/20 shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer',
              activeSlideIndex === template.slides.length - 1
                ? 'opacity-20 cursor-not-allowed hover:scale-100 hover:bg-zinc-950/80'
                : 'opacity-85 hover:opacity-100'
            )}
            title="Slide tiếp theo (Phím mũi tên phải → hoặc Phím cách)"
            aria-label="Slide tiếp theo"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Slide Deck Presentation / Fabric.js Canvas Mode */}
          {isCanvasMode && template.slides[activeSlideIndex] ? (
            <div className="absolute inset-0 z-20 bg-zinc-950 flex flex-col">
              <FabricSlideCanvas
                slide={template.slides[activeSlideIndex]}
                deckTitle={template.title}
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-0">
              {template.slides.map((slide, idx) => {
                const isCurrent = idx === activeSlideIndex;
                return (
                  <div
                    key={slide.id}
                    className={cn(
                      'absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-300 ease-out',
                      isCurrent
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-95 pointer-events-none z-0'
                    )}
                  >
                    <Image
                      src={slide.previewImageUrl}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-contain select-none pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Overview Grid Overlay (ESC or Button) */}
          {isOverview && (
            <div className="absolute inset-0 z-40 bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col animate-in fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Grid className="w-4 h-4 text-primary" />
                  Tổng quan tất cả các slide trong bộ ({template.slides.length}{' '}
                  trang)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOverview(false)}
                  className="text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 cursor-pointer"
                >
                  Đóng tổng quan (ESC)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 overflow-y-auto flex-1 p-1">
                {template.slides.map((s, idx) => {
                  const isSelected = idx === activeSlideIndex;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSlide(idx)}
                      className={cn(
                        'group/card relative aspect-16/9 rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-lg',
                        isSelected
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-zinc-800 hover:border-zinc-500 opacity-80 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={s.previewImageUrl}
                        alt={s.title}
                        fill
                        sizes="320px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-xs font-semibold text-white truncate">
                          #{s.slideNumber}: {s.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Current Slide Info & Prominent Previous / Next Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3 py-2 bg-card/60 rounded-xl border border-border">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <span className="text-xs font-semibold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 shrink-0">
              Trang {currentSlide.slideNumber} / {template.slides.length}
            </span>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {currentSlide.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
                {currentSlide.description}
              </p>
            </div>
          </div>

          {/* Prominent Navigation Buttons (Nút chuyển slide rõ ràng) */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={handlePrev}
              disabled={activeSlideIndex === 0}
              title="Quay lại slide trước (Phím mũi tên trái ←)"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Slide trước
            </Button>

            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={handleNext}
              disabled={activeSlideIndex === template.slides.length - 1}
              title="Chuyển sang slide tiếp theo (Phím mũi tên phải → hoặc Phím cách)"
            >
              Slide tiếp theo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Filmstrip Carousel */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1 text-xs text-muted-foreground">
            <span className="font-semibold flex items-center gap-1.5 text-foreground text-[11px] sm:text-xs">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Danh sách slide trong bộ ({template.slides.length} trang)
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Nhấp slide để chuyển nhanh • Phím [←] [→] hoặc nút mũi tên trên
              màn chiếu
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-1">
            {template.slides.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={slide.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={cn(
                    'relative shrink-0 w-24 sm:w-28 aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer group/thumb shadow-2xs',
                    isActive
                      ? 'border-primary ring-2 ring-primary/40 scale-[1.03]'
                      : 'border-border opacity-70 hover:opacity-100 hover:border-primary/50'
                  )}
                  title={`Xem slide ${slide.slideNumber}: ${slide.title}`}
                >
                  <Image
                    src={slide.previewImageUrl}
                    alt={slide.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-zinc-950/80 text-[10px] font-semibold text-white px-1 py-0.2 rounded-xs">
                    #{slide.slideNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immutability Guarantee Note */}
        <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-accent/30 border border-primary/15 text-muted-foreground text-[11px] sm:text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            <strong className="text-foreground font-semibold">
              Bảo vệ mẫu gốc (Copy-on-Create):
            </strong>{' '}
            Khi bạn chọn &ldquo;Tạo bản trình chiếu mới&rdquo;, hệ thống sẽ tự
            động nhân bản một tệp PowerPoint riêng biệt độc lập. Bộ slide gốc
            của hệ thống sẽ luôn được bảo toàn 100%.
          </span>
        </div>
      </div>
    </Modal>
  );
};
