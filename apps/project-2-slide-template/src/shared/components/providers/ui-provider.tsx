'use client';

import React, { PropsWithChildren } from 'react';
import { PortalRenderer } from '@/shared/components/portal-renderer';
import { Toaster } from '@/shared/components/ui/toaster';

export function UIProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <PortalRenderer />
      <Toaster />
    </>
  );
}
