'use client';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Divider } from '@mui/material';
import Paper from '@mui/material/Paper';
import React from 'react';

import IconButton from '@/components/common/IconButton';
import { useUIStore } from '@/store/uiStore';
import { useWorldStore } from '@/store/worldStore';

export default function Toolbar() {
  const componentDefinitions = useUIStore(state => state.componentDefinitions);
  const selectedComponentKey = useUIStore(state => state.selectedComponentKey);
  const selectComponent = useUIStore(state => state.selectComponent);
  const buildAll = useWorldStore(state => state.buildAll);
  const resetAll = useWorldStore(state => state.resetAll);

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
      {Array.from(componentDefinitions.entries()).map(([key, definition]) => {
        const isSelected = selectedComponentKey === key;
        return (
          <IconButton
            key={key}
            icon={React.createElement(definition.icon, { fontSize: 'small' })}
            tooltip={definition.name}
            ariaLabel={definition.name}
            color={isSelected ? 'primary' : 'inherit'}
            variant={isSelected ? 'contained' : 'text'}
            onClick={() => selectComponent(key)}
          />
        );
      })}
      <Divider orientation="vertical" variant="fullWidth" flexItem />
      <IconButton
        icon={<AutoFixHighIcon fontSize="small" />}
        color="primary"
        variant={'text'}
        tooltip="Generate All"
        ariaLabel="Generate All"
        onClick={buildAll}
      />
      <IconButton
        icon={<RestartAltIcon fontSize="small" />}
        color="error"
        tooltip="Reset All"
        ariaLabel="Reset All"
        onClick={resetAll}
      />
    </Paper>
  );
}
