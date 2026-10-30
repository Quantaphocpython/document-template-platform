'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle, X } from 'lucide-react';
import { PortalProps } from '@/shared/types/portal.types';
import { Button, ButtonSize, ButtonVariant } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/utils';

export const CONFIRM_MODAL_PORTAL_ID = 'system_confirm_modal';

export interface ConfirmModalData {
  title: string;
  message: string;
  mode?: 'confirm' | 'alert';
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmModal: React.FC<PortalProps<ConfirmModalData>> = ({
  isOpen = true,
  onDismiss,
  data,
}) => {
  if (!isOpen || !data) return null;

  const {
    title,
    message,
    mode = 'confirm',
    variant = 'default',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    onConfirm,
    onCancel,
  } = data;

  const handleConfirm = () => {
    onConfirm?.();
    onDismiss?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onDismiss?.();
  };

  const renderIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const iconBgClass = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-50';
      case 'warning':
        return 'bg-amber-50';
      case 'success':
        return 'bg-emerald-50';
      default:
        return 'bg-blue-50';
    }
  };

  const confirmBtnVariant =
    variant === 'destructive' ? ButtonVariant.DESTRUCTIVE : ButtonVariant.DEFAULT;

  return (
    <div
      className={cn(
        'w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-200',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-start p-6 gap-4">
        <div className={cn('p-3 rounded-xl shrink-0', iconBgClass())}>
          {renderIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>
        <Button
          variant={ButtonVariant.GHOST}
          size={ButtonSize.ICON}
          onClick={handleCancel}
          aria-label="Đóng hộp thoại"
        >
          <X className="w-5 h-5 text-slate-400" />
        </Button>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
        {mode === 'confirm' && (
          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.MD}
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
        )}
        <Button
          variant={confirmBtnVariant}
          size={ButtonSize.MD}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

