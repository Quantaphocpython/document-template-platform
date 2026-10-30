'use client';

import React from 'react';
import { Backdrop } from '@/shared/components/ui/backdrop';
import { useLayoutStore } from '@/store/layout.store';
import { PortalInstance } from '@/shared/types/portal.types';

export const PortalRenderer: React.FC = () => {
  const { portals, onDismiss } = useLayoutStore();

  if (portals.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {portals.map((instance) => (
        <PortalInstanceItem
          key={instance.id}
          instance={instance}
          onDismiss={() => onDismiss(instance.id)}
        />
      ))}
    </div>
  );
};

const PortalInstanceItem: React.FC<{
  instance: PortalInstance;
  onDismiss: () => void;
}> = ({ instance, onDismiss }) => {
  const Component = instance.component;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Backdrop
        isOpen={instance.isOpen}
        onPress={() => !instance.disableCloseByBackdrop && onDismiss()}
      />
      <div className="relative z-50 w-full flex items-center justify-center pointer-events-auto">
        <Component
          id={instance.id}
          data={instance.data}
          isOpen={instance.isOpen}
          onDismiss={onDismiss}
        />
      </div>
    </div>
  );
};

