'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

import Diagnostics from '@/components/features/Diagnostics/Diagnostics';
import AppLogo from '@/components/layout/Header/AppLogo';
import UserMenu from '@/components/layout/Header/UserMenu';

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        color: 'text.primary',
        bgcolor: 'background.paper',
        boxShadow: 'none',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar variant="dense" sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
        {/* Logo and Title */}
        <AppLogo />
        {/* Placeholder */}
        <Diagnostics />
        {/* Menu actions */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
