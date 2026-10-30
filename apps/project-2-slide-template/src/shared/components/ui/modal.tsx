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
  maxWidth = ModalMaxWidth.XXXXXL,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[94vh] z-10',
          maxWidthClasses[maxWidth] || maxWidthClasses[ModalMaxWidth.XXXXXL],
        )}
      >
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.ICON}
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
