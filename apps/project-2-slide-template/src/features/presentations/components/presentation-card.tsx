import { SlideCategory, SlideTemplate } from '@/types';
import {
  Badge,
  BadgeVariant,
  Button,
  ButtonSize,
  ButtonVariant,
} from 'ui';
import { Eye, Layers, Plus, Tag } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

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
    <div className="group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* 16:9 Presentation Cover Thumbnail */}
      <div
        className="relative w-full aspect-16/9 bg-zinc-950 overflow-hidden cursor-pointer"
        onClick={() => onPreview(template)}
      >
        <Image
          src={template.thumbnailUrl}
          alt={template.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground text-background text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Xem trước {template.totalSlides} slide
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Category & Slide Count Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant={getBadgeVariantForCategory(template.category)}>
            {template.categoryName}
          </Badge>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground font-mono">
            <Layers className="w-3 h-3 text-primary" />
            {template.totalSlides} slides (16:9)
          </span>
        </div>

        <h3
          onClick={() => onPreview(template)}
          className="font-bold text-foreground text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
          title={template.title}
        >
          {template.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[11px] text-secondary-foreground bg-secondary/80 px-2.5 py-0.5 rounded-md border border-secondary font-medium"
            >
              <Tag className="w-2.5 h-2.5 text-secondary-foreground/70" />
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="text-[10px] font-medium text-muted-foreground">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-border">
          <span className="text-xs font-semibold text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md">
            .pptx
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={() => onPreview(template)}
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Xem {template.totalSlides} slide
            </Button>
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.SM}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Dùng mẫu này
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
