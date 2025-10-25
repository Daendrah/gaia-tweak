'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import HelpIcon from '@mui/icons-material/Help';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import React, { useCallback } from 'react';

import IconButton from '@/components/common/IconButton';
import { useUIStore } from '@/store/uiStore';

export default function UserMenu() {
  const settingsPanelOpened = useUIStore(state => state.settingsPanelOpened);
  const toggleSettingsPanelState = useUIStore(state => state.toggleSettingsPanelState);
  const themeMode = useUIStore(state => state.themeMode);
  const toggleThemeMode = useUIStore(state => state.toggleThemeMode);

  const toggleSettings = useCallback(() => {
    toggleSettingsPanelState(!settingsPanelOpened);
  }, [settingsPanelOpened, toggleSettingsPanelState]);

  const openGitHub = useCallback(() => {
    window.open('https://github.com/Daendrah/gaia-tweak', '_blank');
  }, []);

  const toggleTheme = useCallback(() => {
    toggleThemeMode();
  }, [toggleThemeMode]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton
        onClick={toggleSettings}
        tooltip={'Settings'}
        ariaLabel="Settings"
        icon={<SettingsIcon fontSize="small" />}
        color={settingsPanelOpened ? 'primary' : 'inherit'}
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
