import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
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
  OUTLINE = 'outline',
}

export const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        [BadgeVariant.DEFAULT]:
          'border-transparent bg-primary text-primary-foreground shadow-2xs',
        [BadgeVariant.SLATE]:
          'border-border bg-muted text-muted-foreground',
        [BadgeVariant.OUTLINE]:
          'text-foreground border-border bg-background',
        [BadgeVariant.BLUE]:
          'border-primary/20 bg-accent text-accent-foreground font-medium',
        [BadgeVariant.PURPLE]:
          'border-primary/20 bg-accent text-accent-foreground font-medium',
        [BadgeVariant.INDIGO]:
          'border-primary/25 bg-secondary text-secondary-foreground font-medium',
        [BadgeVariant.GREEN]:
          'border-emerald-200/80 bg-emerald-50 text-emerald-700',
        [BadgeVariant.EMERALD]:
          'border-emerald-200/80 bg-emerald-50 text-emerald-700',
        [BadgeVariant.AMBER]:
          'border-amber-200/80 bg-amber-50 text-amber-700',
      },
    },
    defaultVariants: {
      variant: BadgeVariant.DEFAULT,
    },
  },
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
