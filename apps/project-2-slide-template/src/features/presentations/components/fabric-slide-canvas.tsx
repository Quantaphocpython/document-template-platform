'use client';

import { SlideItem } from '@/types';
import {
  Canvas,
  FabricObject,
  loadSVGFromURL,
  Rect,
  Textbox,
  util,
} from 'fabric';
import {
  Download,
  MousePointer,
  RotateCcw,
  Square,
  Trash2,
  Type,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, BadgeVariant, Button, ButtonSize, ButtonVariant } from 'ui';

export interface FabricSlideCanvasProps {
  slide: SlideItem;
  deckTitle?: string;
  className?: string;
}

export const FabricSlideCanvas: React.FC<FabricSlideCanvasProps> = ({
  slide,
  deckTitle,
  className = '',
}) => {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedObj, setSelectedObj] = useState<FabricObject | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 960, height: 540 });

  // 1. Initialize and render slide into Fabric Canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    let isDisposed = false;
    setIsLoading(true);

    // Virtual presentation resolution 16:9 (1280x720)
    const baseW = 1280;
    const baseH = 720;

    const fabricCanvas = new Canvas(canvasElRef.current, {
      width: baseW,
      height: baseH,
      backgroundColor: '#09090b',
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = fabricCanvas;

    // Selection listeners
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObj(e.selected?.[0] ?? null);
    });
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObj(e.selected?.[0] ?? null);
    });
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObj(null);
    });

    // Load SVG vector presentation layer into Fabric Canvas
    loadSVGFromURL(slide.previewImageUrl)
      .then(({ objects, options }) => {
        if (isDisposed) return;
        const validObjects = objects.filter((o): o is NonNullable<typeof o> => o !== null);
        
        if (validObjects.length > 0) {
          const group = util.groupSVGElements(validObjects, options);
          
          // Scale to fit 1280x720 canvas
          const groupW = group.width || baseW;
          const groupH = group.height || baseH;
          const scale = Math.min(baseW / groupW, baseH / groupH);
          
          group.set({
            scaleX: scale,
            scaleY: scale,
            left: (baseW - groupW * scale) / 2,
            top: (baseH - groupH * scale) / 2,
            selectable: true,
            hasControls: true,
          });

          fabricCanvas.add(group);
          fabricCanvas.renderAll();
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading slide into Fabric canvas:', err);
        setIsLoading(false);
      });

    // Resize observer to keep canvas responsive within its parent container
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerW = rect.width;
      const targetW = Math.max(320, containerW);
      const targetH = targetW * (9 / 16);
      
      setCanvasDimensions({ width: targetW, height: targetH });
      
      const zoom = targetW / baseW;
      fabricCanvas.setDimensions({ width: targetW, height: targetH });
      fabricCanvas.setZoom(zoom);
      fabricCanvas.renderAll();
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      isDisposed = true;
      observer.disconnect();
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
  }, [slide.id, slide.previewImageUrl]);

  // 2. Canvas Actions (Add Textbox, Add Card, Delete, Export)
  const handleAddTextbox = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const textbox = new Textbox('Nhấp đúp để nhập tiêu đề / ghi chú...', {
      left: 100,
      top: 150,
      width: 400,
      fontSize: 28,
      fill: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: 'rgba(24, 24, 27, 0.75)',
      padding: 12,
      cornerColor: '#3b82f6',
      cornerSize: 10,
      transparentCorners: false,
    });

    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
  }, []);

  const handleAddCard = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const card = new Rect({
      left: 120,
      top: 250,
      width: 320,
      height: 180,
      fill: 'rgba(30, 41, 59, 0.85)',
      stroke: '#3b82f6',
      strokeWidth: 2,
      rx: 16,
      ry: 16,
      cornerColor: '#3b82f6',
      cornerSize: 10,
      transparentCorners: false,
    });

    canvas.add(card);
    canvas.setActiveObject(card);
    canvas.renderAll();
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.renderAll();
      setSelectedObj(null);
    }
  }, []);

  const handleExportPng = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: 'png',
      multiplier: 2, // High DPI (2560x1440)
    });

    const link = document.createElement('a');
    link.download = `${deckTitle || 'slide'}-slide-${slide.slideNumber}.png`;
    link.href = dataUrl;
    link.click();
  }, [deckTitle, slide.slideNumber]);

  return (
    <div className={`flex flex-col h-full w-full select-none ${className}`}>
      {/* Top Canvas Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-zinc-900/90 backdrop-blur-md border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant={BadgeVariant.OUTLINE}>
            Fabric.js HTML5 Canvas Engine
          </Badge>
          <span className="text-zinc-400 hidden sm:inline">
            Slide {slide.slideNumber}: {slide.title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={handleAddTextbox}
            title="Thêm Text Box vector (Fabric.Textbox)"
          >
            <Type className="w-3.5 h-3.5 mr-1 text-primary" />
            <span className="hidden sm:inline">Thêm Chữ</span>
          </Button>

          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={handleAddCard}
            title="Thêm Vector Card (Fabric.Rect)"
          >
            <Square className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            <span className="hidden sm:inline">Thêm Khối</span>
          </Button>

          {selectedObj && (
            <Button
              variant={ButtonVariant.DESTRUCTIVE}
              size={ButtonSize.SM}
              onClick={handleDeleteSelected}
              title="Xóa đối tượng đang chọn"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Xóa</span>
            </Button>
          )}

          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.SM}
            onClick={handleExportPng}
            title="Tải ảnh PNG độ nét cao từ Canvas (2x DPI)"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Tải PNG</span>
          </Button>
        </div>
      </div>

      {/* Responsive Canvas Wrapper */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full aspect-video flex items-center justify-center bg-zinc-950 overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xs text-zinc-400 text-xs">
            <RotateCcw className="w-6 h-6 animate-spin text-primary mb-2" />
            <span>Đang dựng slide trên HTML5 Canvas 2D Engine...</span>
          </div>
        )}

        <canvas
          ref={canvasElRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          className="shadow-2xl"
        />

        {/* Bottom Status bar */}
        <div className="absolute bottom-2 left-3 z-10 flex items-center gap-2 pointer-events-none text-[11px] text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10">
          <MousePointer className="w-3 h-3 text-primary" />
          <span>Click đối tượng để di chuyển hoặc chỉnh sửa trên Canvas</span>
        </div>
      </div>
    </div>
  );
};
