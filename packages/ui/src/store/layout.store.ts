import { create } from 'zustand';
import { PortalInstance } from '../types/portal.types.js';

interface LayoutState {
  portals: PortalInstance[];
  onPresent: (instance: PortalInstance) => void;
  onDismiss: (id?: string) => void;
  closeAllPortals: () => void;
  removePortal: (id: string) => void;
}

const initialState = {
  portals: [],
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  ...initialState,

  onPresent: (instance) => {
    const { portals } = get();
    const existingIndex = portals.findIndex(
      (portal) => portal.id === instance.id,
    );

    if (existingIndex > -1) {
      set({
        portals: portals.map((portal, i) =>
          i === existingIndex
            ? { ...portal, ...instance, isOpen: true }
            : portal,
        ),
      });
      return;
    }

    set({
      portals: [...portals, { ...instance, isOpen: true }],
    });
  },

  onDismiss: (id) => {
    const { portals, removePortal } = get();
    if (portals.length === 0) return;

    const targetId = id || portals[portals.length - 1].id;

    set({
      portals: portals.map((portal) =>
        portal.id === targetId ? { ...portal, isOpen: false } : portal,
      ),
    });

    setTimeout(() => {
      const currentPortals = get().portals;
      const portal = currentPortals.find((p) => p.id === targetId);
      if (portal && !portal.isOpen && targetId) {
        removePortal(targetId);
      }
    }, 250);
  },

  closeAllPortals: () => {
    set({ ...initialState });
  },

  removePortal: (id) => {
    const { portals } = get();
    set({
      portals: portals.filter((portal) => portal.id !== id),
    });
  },
}));
