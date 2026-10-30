import React from 'react';
import Image from 'next/image';
import { Eye, Plus, Layers, Tag } from 'lucide-react';
import { SlideCategory, SlideTemplate } from '@/types';
import { Badge, BadgeVariant } from '@/shared/components/ui/badge';
import { Button, ButtonSize, ButtonVariant } from '@/shared/components/ui/button';

export interface PresentationCardProps {
  template: SlideTemplate;
  onPreview: (template: SlideTemplate) => void;
  onUseTemplate: (template: SlideTemplate) => void;
  isCreating?: boolean;
}

export const CATEGORY_BADGE_MAP: Record<SlideCategory, BadgeVariant> = {
  [SlideCategory.ALL]: BadgeVariant.DEFAULT,
  [SlideCategory.PITCH_DECK]: BadgeVariant.INDIGO,
  [SlideCategory.QUARTERLY_REVIEW]: BadgeVariant.EMERALD,
  [SlideCategory.PRODUCT_LAUNCH]: BadgeVariant.AMBER,
};

export const getBadgeVariantForCategory = (category: string): BadgeVariant => {
  return CATEGORY_BADGE_MAP[category as SlideCategory] ?? BadgeVariant.DEFAULT;
};

export const PresentationCard: React.FC<PresentationCardProps> = ({
  template,
  onPreview,
  onUseTemplate,
  isCreating = false,
}) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* 16:9 Presentation Cover Thumbnail */}
      <div
        className="relative w-full aspect-16/9 bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onPreview(template)}
      >
        <Image
          src={template.thumbnailUrl}
          alt={template.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            Xem trước bộ {template.totalSlides} slide
          </span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant={getBadgeVariantForCategory(template.category)}>
            {template.categoryName}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md border border-white/20">
            <Layers className="w-3 h-3 text-indigo-400" />
            {template.totalSlides} slides (16:9)
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 flex flex-col p-5">
        <h3
          onClick={() => onPreview(template)}
          className="font-bold text-slate-900 text-base leading-snug line-clamp-1 hover:text-indigo-600 transition-colors cursor-pointer"
          title={template.title}
        >
          {template.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100"
            >
              <Tag className="w-2.5 h-2.5 text-slate-400" />
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="text-[10px] text-slate-400">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-mono">
            .pptx
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={() => onPreview(template)}
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Xem slide
            </Button>
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.SM}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tạo bài trình chiếu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

