'use client';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HelpIcon from '@mui/icons-material/Help';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import React, { useCallback } from 'react';

import IconButton from '@/components/common/IconButton';
import { useUIStore } from '@/store/uiStore';
import { useWorldStore } from '@/store/worldStore';

export default function UserMenu() {
  const themeMode = useUIStore(state => state.themeMode);
  const toggleThemeMode = useUIStore(state => state.toggleThemeMode);
  const generateAll = useWorldStore(state => state.generateAll);
  const clearAll = useWorldStore(state => state.clearAll);

  const openGitHub = useCallback(() => {
    window.open('https://github.com/Daendrah/gaia-tweak', '_blank');
  }, []);

  const toggleTheme = useCallback(() => {
    toggleThemeMode();
  }, [toggleThemeMode]);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, padding: 1 }}
    >
      <IconButton
        icon={<AutoFixHighIcon fontSize="small" />}
        color="primary"
        variant={'text'}
        tooltip="Generate All"
        ariaLabel="Generate All"
        onClick={generateAll}
      />
      <IconButton
        icon={<RestartAltIcon fontSize="small" />}
        color="error"
        tooltip="Reset All"
        ariaLabel="Reset All"
        onClick={clearAll}
      />
      <IconButton
        onClick={openGitHub}
        tooltip="Help"
        ariaLabel="Help"
        icon={<HelpIcon fontSize="small" />}
      />
      <IconButton
        onClick={toggleTheme}
        tooltip={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        ariaLabel="Toggle theme"
        icon={
          themeMode === 'dark' ? (
            <DarkModeIcon fontSize="small" />
          ) : (
            <LightModeIcon fontSize="small" />
          )
        }
      />
    </Box>
  );
}
