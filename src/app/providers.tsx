'use client';

import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ToastProvider placement="bottom-center" />
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
