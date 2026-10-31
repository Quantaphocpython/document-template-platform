'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useToastStore, ToastItem } from '../utils/toast-helper.js';
import { cn } from '../utils/cn.js';

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ item: ToastItem; onDismiss: () => void }> = ({ item, onDismiss }) => {
  const renderIcon = () => {
    switch (item.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border bg-slate-900 text-white border-slate-800 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4'
      )}
    >
      {renderIcon()}
      <div className="flex-1 text-xs">
        {item.title && <div className="font-semibold text-sm mb-0.5">{item.title}</div>}
        <div className="text-slate-300 leading-relaxed whitespace-pre-line">{item.message}</div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

