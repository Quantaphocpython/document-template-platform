'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button, ButtonSize, ButtonVariant } from './button';

export enum ModalMaxWidth {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
  XXXXL = '4xl',
  XXXXXL = '5xl',
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: ModalMaxWidth | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
}

const maxWidthClasses: Record<string, string> = {
  [ModalMaxWidth.SM]: 'max-w-sm',
  [ModalMaxWidth.MD]: 'max-w-md',
  [ModalMaxWidth.LG]: 'max-w-lg',
  [ModalMaxWidth.XL]: 'max-w-xl',
  [ModalMaxWidth.XXL]: 'max-w-2xl',
  [ModalMaxWidth.XXXXL]: 'max-w-4xl',
  [ModalMaxWidth.XXXXXL]: 'max-w-5xl',
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
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10',
          maxWidthClasses[maxWidth] || maxWidthClasses[ModalMaxWidth.XXXXL],
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
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
          >
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
