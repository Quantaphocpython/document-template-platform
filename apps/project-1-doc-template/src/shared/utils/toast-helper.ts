import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Math.random().toString(36).substring(7)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  error: (message: string, options?: { title?: string }) => {
    useToastStore.getState().addToast({
      type: 'error',
      message,
      title: options?.title,
    });
  },
  success: (message: string, options?: { title?: string }) => {
    useToastStore.getState().addToast({
      type: 'success',
      message,
      title: options?.title,
    });
  },
  info: (message: string, options?: { title?: string }) => {
    useToastStore.getState().addToast({
      type: 'info',
      message,
      title: options?.title,
    });
  },
  warning: (message: string, options?: { title?: string }) => {
    useToastStore.getState().addToast({
      type: 'warning',
      message,
      title: options?.title,
    });
  },
};

