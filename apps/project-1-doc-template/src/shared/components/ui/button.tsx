import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

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
  'inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        [ButtonVariant.DEFAULT]: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent',
        [ButtonVariant.SECONDARY]: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-transparent',
        [ButtonVariant.OUTLINE]: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-sm',
        [ButtonVariant.GHOST]: 'text-slate-700 hover:bg-slate-100 border border-transparent',
        [ButtonVariant.SUBTLE]: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-transparent',
        [ButtonVariant.DESTRUCTIVE]: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
      },
      size: {
        [ButtonSize.SM]: 'text-xs px-2.5 py-1.5 h-8 gap-1.5 rounded-md',
        [ButtonSize.MD]: 'text-sm px-4 py-2 h-10 gap-2 rounded-lg',
        [ButtonSize.LG]: 'text-base px-5 py-2.5 h-11 gap-2.5 rounded-lg',
        [ButtonSize.ICON]: 'h-9 w-9 p-0 flex items-center justify-center rounded-lg',
      },
    },
    defaultVariants: {
      variant: ButtonVariant.DEFAULT,
      size: ButtonSize.MD,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
    ref
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
  }
);

Button.displayName = 'Button';
