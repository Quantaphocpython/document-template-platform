import { Template, TemplateCategory } from '@/types';
import { Eye, Plus, Tag } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Badge, BadgeVariant, Button, ButtonSize, ButtonVariant } from 'ui';

export interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
  isCreating?: boolean;
}

export const CATEGORY_BADGE_MAP: Record<TemplateCategory, BadgeVariant> = {
  [TemplateCategory.ALL]: BadgeVariant.DEFAULT,
  [TemplateCategory.CONTRACT]: BadgeVariant.BLUE,
  [TemplateCategory.HR]: BadgeVariant.GREEN,
  [TemplateCategory.MEETING]: BadgeVariant.PURPLE,
  [TemplateCategory.REPORT]: BadgeVariant.SLATE,
  [TemplateCategory.PROPOSAL]: BadgeVariant.AMBER,
};

export const getBadgeVariantForCategory = (category: string): BadgeVariant => {
  return CATEGORY_BADGE_MAP[category as TemplateCategory] ?? BadgeVariant.DEFAULT;
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onUseTemplate,
  isCreating = false,
}) => {
  return (
    <div className="group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Thumbnail Container */}
      <div
        className="relative w-full aspect-16/10 bg-muted/40 border-b border-border overflow-hidden cursor-pointer"
        onClick={() => onPreview(template)}
      >
        <Image
          src={template.thumbnailUrl}
          alt={template.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground/90 text-background text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            Nhấp để xem trước
          </span>
        </div>
        <div className="absolute top-2.5 left-2.5">
          <Badge variant={getBadgeVariantForCategory(template.category)}>
            {template.categoryName}
          </Badge>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[10px] font-mono bg-card/90 text-foreground/80 px-2 py-0.5 rounded-md border border-border shadow-2xs font-medium">
            v{template.version}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
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
            .docx
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={() => onPreview(template)}
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Xem trước
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
