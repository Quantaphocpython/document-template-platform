import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils/cn.js';

export enum ButtonVariant {
  DEFAULT = 'default',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  SUBTLE = 'subtle',
  DESTRUCTIVE = 'destructive',
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  ICON = 'icon',
}

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        [ButtonVariant.DEFAULT]:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 active:scale-[0.98]',
        [ButtonVariant.SECONDARY]:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
        [ButtonVariant.OUTLINE]:
          'border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground shadow-2xs active:scale-[0.98]',
        [ButtonVariant.GHOST]:
          'text-foreground hover:bg-accent hover:text-accent-foreground',
        [ButtonVariant.SUBTLE]:
          'bg-accent text-accent-foreground hover:bg-accent/80',
        [ButtonVariant.DESTRUCTIVE]:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs active:scale-[0.98]',
      },
      size: {
        [ButtonSize.SM]: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
        [ButtonSize.MD]: 'h-9 px-4 py-2 text-sm gap-2 rounded-xl',
        [ButtonSize.LG]: 'h-10 px-6 text-sm gap-2 rounded-xl',
        [ButtonSize.ICON]:
          'h-9 w-9 p-0 flex items-center justify-center rounded-xl',
      },
    },
    defaultVariants: {
      variant: ButtonVariant.DEFAULT,
      size: ButtonSize.MD,
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = ButtonVariant.DEFAULT,
      size = ButtonSize.MD,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
