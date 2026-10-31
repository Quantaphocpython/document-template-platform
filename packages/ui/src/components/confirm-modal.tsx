'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import React from 'react';
import { PortalProps } from '../types/portal.types.js';
import { cn } from '../utils/cn.js';
import { Button, ButtonSize, ButtonVariant } from './button.js';

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
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return ButtonVariant.DESTRUCTIVE;
      default:
        return ButtonVariant.DEFAULT;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        'w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 transition-all duration-200 transform',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
      )}
    >
      <div className="flex justify-end -mt-2 -mr-2">
        <button
          onClick={handleCancel}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center -mt-2">
        {renderIcon()}
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center gap-3 mt-6">
        {mode === 'confirm' && (
          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.MD}
            onClick={handleCancel}
            className="flex-1"
          >
            {cancelText}
          </Button>
        )}
        <Button
          variant={getConfirmButtonVariant()}
          size={ButtonSize.MD}
          onClick={handleConfirm}
          className="flex-1"
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};
