import React from 'react';
import { CategoryInfo, SlideCategory } from '@/types';
import { cn } from 'ui';
import { Presentation, Rocket, TrendingUp, Sparkles } from 'lucide-react';

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
              'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none',
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
            )}
          >
            {getCategoryIcon(cat.id)}
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
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

