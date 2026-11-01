import { CategoryInfo, SlideCategory } from '@/types';
import { Presentation, Rocket, Sparkles, TrendingUp } from 'lucide-react';
import React from 'react';
import { cn } from 'ui';

export interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: SlideCategory;
  onSelectCategory: (category: SlideCategory) => void;
  counts?: Record<string, number>;
}

const getCategoryIcon = (id: SlideCategory) => {
  switch (id) {
    case SlideCategory.PITCH_DECK:
      return <Sparkles className="w-4 h-4" />;
    case SlideCategory.QUARTERLY_REVIEW:
      return <TrendingUp className="w-4 h-4" />;
    case SlideCategory.PRODUCT_LAUNCH:
      return <Rocket className="w-4 h-4" />;
    case SlideCategory.ALL:
    default:
      return <Presentation className="w-4 h-4" />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = counts?.[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer select-none',
              isSelected
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold ring-2 ring-primary/20'
                : 'bg-card text-foreground/80 hover:bg-accent hover:text-accent-foreground border border-border shadow-2xs'
            )}
          >
            {getCategoryIcon(cat.id)}
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-foreground/70'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
