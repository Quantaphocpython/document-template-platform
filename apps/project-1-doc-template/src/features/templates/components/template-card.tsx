import React from 'react';
import Image from 'next/image';
import { Eye, Plus, Tag } from 'lucide-react';
import { Template, TemplateCategory } from '@/types';
import { Badge, BadgeVariant } from '@/shared/components/ui/badge';
import { Button, ButtonSize, ButtonVariant } from '@/shared/components/ui/button';

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
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Thumbnail Container */}
      <div
        className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onPreview(template)}
      >
        <Image
          src={template.thumbnailUrl}
          alt={template.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            Nhấp để xem trước
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant={getBadgeVariantForCategory(template.category)}>
            {template.categoryName}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-mono bg-white/90 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
            v{template.version}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 flex flex-col p-5">
        <h3
          onClick={() => onPreview(template)}
          className="font-bold text-slate-900 text-base leading-snug line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer"
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

