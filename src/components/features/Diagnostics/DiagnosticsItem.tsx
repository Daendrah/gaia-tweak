'use client';

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import React, { memo } from 'react';

interface DiagnosticsItemProps {
  icon: React.ReactElement;
  label: string;
  value: number;
  suffix?: string;
}

const DiagnosticsItem = memo<DiagnosticsItemProps>(({ icon, label, value, suffix }) => {
  const metrics = suffix ? `${value} ${suffix}` : `${value}`;

  return (
    <Tooltip title={label}>
      <Chip
        icon={icon}
        label={metrics}
        variant="filled"
        size="small"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
          color: theme => theme.palette.text.primary,
          '.MuiChip-icon': {
            color: theme => theme.palette.info.main, // Code couleur pour l'état
          },
          px: 2,
        }}
      />
    </Tooltip>
  );
});

DiagnosticsItem.displayName = 'DiagnosticsItem';
export default DiagnosticsItem;
