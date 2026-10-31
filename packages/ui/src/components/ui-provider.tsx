'use client';

import React, { PropsWithChildren } from 'react';
import { PortalRenderer } from './portal-renderer.js';
import { Toaster } from './toaster.js';

export function UIProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <PortalRenderer />
      <Toaster />
    </>
  );
}

