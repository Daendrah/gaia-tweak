'use client';

import { ToastProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ToastProvider placement="bottom" />
      {children}
    </ThemeProvider>
  );
}
