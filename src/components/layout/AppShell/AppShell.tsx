'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect } from 'react';

import Viewport from '@/components/features/Viewport/Viewport';
import Header from '@/components/layout/Header/Header';
import { useUIStore } from '@/store/uiStore';

export default function AppShell() {
  const initializeTheme = useUIStore(state => state.initializeTheme);
  const themeMode = useUIStore(state => state.themeMode);
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ThemeProvider theme={theme}>
        {/* Header Section */}
        <Header />
        {/* Content Section */}
        <main style={{ flex: 1, minHeight: 0 }}>
          <Viewport />
        </main>
      </ThemeProvider>
    </div>
  );
}
