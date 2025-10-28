'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect } from 'react';

import Editor from '@/components/features/Editor/Editor';
import Header from '@/components/layout/Header/Header';
import Notification from '@/components/layout/Notification/Notification';
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
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
    >
      <ThemeProvider theme={theme}>
        {/* Header Section */}
        <Header />
        {/* Content Section */}
        <Editor />
        {/* Notification System */}
        <Notification />
      </ThemeProvider>
    </div>
  );
}
