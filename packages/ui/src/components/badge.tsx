import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';

export enum BadgeVariant {
  DEFAULT = 'default',
  BLUE = 'blue',
  GREEN = 'green',
  AMBER = 'amber',
  PURPLE = 'purple',
  SLATE = 'slate',
  INDIGO = 'indigo',
  EMERALD = 'emerald',
}

export const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
  {
    variants: {
      variant: {
        [BadgeVariant.DEFAULT]: 'bg-slate-100 text-slate-700 border-slate-200',
        [BadgeVariant.BLUE]: 'bg-blue-50 text-blue-700 border-blue-200',
        [BadgeVariant.GREEN]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        [BadgeVariant.AMBER]: 'bg-amber-50 text-amber-700 border-amber-200',
        [BadgeVariant.PURPLE]: 'bg-purple-50 text-purple-700 border-purple-200',
        [BadgeVariant.SLATE]: 'bg-slate-100 text-slate-600 border-slate-200',
        [BadgeVariant.INDIGO]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        [BadgeVariant.EMERALD]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
    },
    defaultVariants: {
      variant: BadgeVariant.DEFAULT,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
};
