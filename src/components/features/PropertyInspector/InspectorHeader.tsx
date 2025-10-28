'use client';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Button, IconButton, Stack, Switch, Toolbar, Typography } from '@mui/material';
import React, { memo } from 'react';

import { componentRegistry } from '@/lib/world/componentRegistry';
import { useComponentsStore } from '@/store/componentsStore';
import { useUIStore } from '@/store/uiStore';
import { useWorldStore } from '@/store/worldStore';

interface InspectorHeaderProps {
  componentKey: string;
}

const InspectorHeader = memo(function InspectorHeader({ componentKey }: InspectorHeaderProps) {
  const selectComponent = useUIStore(state => state.selectComponent);

  const hasChanges = useComponentsStore(
    state => (state.componentInstances[componentKey]?.pendingCount ?? 0) > 0
  );
  const isActive = useComponentsStore(
    state => Object.keys(state.componentInstances[componentKey]?.committed ?? {}).length > 0
  );

  const generateComponent = useWorldStore(state => state.generateComponent);
  const clearComponent = useWorldStore(state => state.clearComponent);
  const clearChanges = useComponentsStore(state => state.clearChanges);

  const componentDefinition = componentRegistry.getDefinition(componentKey);
  if (!componentDefinition) return null;

  const IconComponent = componentDefinition.icon as React.ComponentType<{ sx?: object }>;

  const handleApply = () => {
    generateComponent(componentKey);
  };

  const handleReset = () => {
    clearChanges(componentKey);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      generateComponent(componentKey);
    } else {
      clearComponent(componentKey);
    }
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Toolbar variant="dense" />

      {/* Header Line */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconComponent sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            {componentDefinition.name}
          </Typography>
        </Box>

        <IconButton onClick={() => selectComponent(null)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Actions Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            onClick={handleApply}
            disabled={!hasChanges}
            sx={{ textTransform: 'none', minWidth: 80 }}
          >
            Apply
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{ textTransform: 'none', minWidth: 80 }}
          >
            Reset
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Active
          </Typography>
          <Switch checked={isActive} onChange={handleToggle} size="small" />
        </Box>
      </Box>
    </Box>
  );
});

export default InspectorHeader;
