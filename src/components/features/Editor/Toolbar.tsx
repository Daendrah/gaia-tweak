'use client';

import Paper from '@mui/material/Paper';
import React, { useMemo } from 'react';

import IconButton from '@/components/common/IconButton';
import { componentRegistry } from '@/lib/world/componentRegistry';
import { useUIStore } from '@/store/uiStore';

export default function Toolbar() {
  const selectedComponentKey = useUIStore(state => state.selectedComponentKey);
  const selectComponent = useUIStore(state => state.selectComponent);

  const componentDefinitions = useMemo(() => {
    return componentRegistry.getAllDefinitions();
  }, []);

  return (
    <Paper
      sx={{
        bottom: theme => theme.spacing(2),
        left: '50%',
        transform: 'translateX(-50%)',
        position: 'fixed',
        zIndex: theme => theme.zIndex.appBar,
        display: 'flex',
        padding: 1,
        gap: 1,
      }}
    >
      {componentDefinitions.map(definition => {
        const isSelected = selectedComponentKey === definition.key;
        return (
          <IconButton
            key={definition.key}
            icon={React.createElement(definition.icon, { fontSize: 'small' })}
            tooltip={definition.name}
            ariaLabel={definition.name}
            color={isSelected ? 'primary' : 'inherit'}
            variant={isSelected ? 'contained' : 'text'}
            onClick={() => selectComponent(definition.key)}
          />
        );
      })}
    </Paper>
  );
}
