'use client';

import { Divider } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

import SettingsItem from '@/components/features/Settings/SettingsItem';
import { useUIStore } from '@/store/uiStore';

export default function SettingsPanel() {
  const isSettingsPanelOpened = useUIStore(state => state.settingsPanelOpened);
  const toggleSettingsPanelState = useUIStore(state => state.toggleSettingsPanelState);
  const componentDefinitions = useUIStore(state => state.componentDefinitions);

  return (
    <Drawer
      anchor="right"
      open={isSettingsPanelOpened}
      onClose={() => {
        toggleSettingsPanelState(false);
      }}
      variant="persistent"
      sx={{
        width: 360,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 360,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar variant="dense" />
      <CardHeader title="Settings" />
      <Divider />
      {Array.from(componentDefinitions.entries()).map(([key]) => (
        <SettingsItem key={key} componentKey={key} />
      ))}
    </Drawer>
  );
}
