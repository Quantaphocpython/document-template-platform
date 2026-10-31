'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { cn } from '../utils/cn.js';
import { Button, ButtonSize, ButtonVariant } from './button.js';

export enum ModalMaxWidth {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
  XXXL = '3xl',
  XXXXL = '4xl',
  XXXXXL = '5xl',
  XXXXXXL = '6xl',
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?:
    | ModalMaxWidth
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl';
}

const maxWidthClasses: Record<string, string> = {
  [ModalMaxWidth.SM]: 'max-w-sm',
  [ModalMaxWidth.MD]: 'max-w-md',
  [ModalMaxWidth.LG]: 'max-w-lg',
  [ModalMaxWidth.XL]: 'max-w-xl',
  [ModalMaxWidth.XXL]: 'max-w-2xl',
  [ModalMaxWidth.XXXL]: 'max-w-3xl',
  [ModalMaxWidth.XXXXL]: 'max-w-4xl',
  [ModalMaxWidth.XXXXXL]: 'max-w-5xl',
  [ModalMaxWidth.XXXXXXL]: 'max-w-6xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = ModalMaxWidth.XXXXL,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200',
          maxWidthClasses[maxWidth] || 'max-w-4xl',
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-white">
            <div>
              {title && (
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              )}
              {description && (
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
            <Button
              variant={ButtonVariant.GHOST}
              size={ButtonSize.ICON}
              onClick={onClose}
              aria-label="Đóng cửa sổ"
              className="text-slate-400 hover:text-slate-700 -mr-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
