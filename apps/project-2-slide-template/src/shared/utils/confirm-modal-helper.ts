import { CONFIRM_MODAL_PORTAL_ID, ConfirmModal, ConfirmModalData } from '@/shared/components/ui/confirm-modal';
import { useLayoutStore } from '@/store/layout.store';

export const confirmModal = {
  show: (data: ConfirmModalData) => {
    useLayoutStore.getState().onPresent({
      id: CONFIRM_MODAL_PORTAL_ID,
      component: ConfirmModal,
      data,
    });
  },

  alert: (title: string, message: string, onConfirm?: () => void) => {
    useLayoutStore.getState().onPresent({
      id: CONFIRM_MODAL_PORTAL_ID,
      component: ConfirmModal,
      data: {
        title,
        message,
        mode: 'alert',
        variant: 'default',
        confirmText: 'Đã hiểu',
        onConfirm,
      },
    });
  },

  error: (title: string, message: string, onConfirm?: () => void) => {
    useLayoutStore.getState().onPresent({
      id: CONFIRM_MODAL_PORTAL_ID,
      component: ConfirmModal,
      data: {
        title,
        message,
        mode: 'alert',
        variant: 'destructive',
        confirmText: 'Đóng',
        onConfirm,
      },
    });
  },

  close: () => {
    useLayoutStore.getState().onDismiss(CONFIRM_MODAL_PORTAL_ID);
  },
};

