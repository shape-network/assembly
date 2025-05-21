'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group rounded-3xl"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      position="top-center"
      toastOptions={{
        style: {
          boxShadow: 'var(--shadow-xs)',
          borderRadius: 'var(--radius)',
        },
      }}
      {...props}
    />
  );
};
