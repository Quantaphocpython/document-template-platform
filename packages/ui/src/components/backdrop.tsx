'use client';

import React from 'react';
import { cn } from '../utils/cn.js';

export interface BackdropProps {
  isOpen?: boolean;
  onPress?: () => void;
  className?: string;
}

export const Backdrop: React.FC<BackdropProps> = ({
  isOpen = true,
  onPress,
  className,
}) => {
  return (
    <div
      onClick={onPress}
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 cursor-pointer',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        className
      )}
    />
  );
};

