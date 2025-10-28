'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import React from 'react';

import InspectorHeader from '@/components/features/PropertyInspector/InspectorHeader';
import InspectorList from '@/components/features/PropertyInspector/InspectorList';
import { useUIStore } from '@/store/uiStore';

export default function PropertyInspector() {
  const selectedComponentKey = useUIStore(state => state.selectedComponentKey);
  if (!selectedComponentKey) {
    return null;
  }

  return (
    <Drawer
      anchor="right"
      open={selectedComponentKey !== null}
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <InspectorHeader componentKey={selectedComponentKey} />
        <InspectorList />
      </Box>
    </Drawer>
  );
}
