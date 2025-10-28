'use client';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React, { ReactNode, memo } from 'react';

interface FieldRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  isModified?: boolean;
  onReset?: () => void;
}

const FieldRow = memo(function FieldRow({
  label,
  description,
  children,
  isModified = false,
  onReset,
}: FieldRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 0.5,
        minHeight: 28,
        '&:hover': {
          bgcolor: 'action.hover',
          '& .reset-button': {
            visibility: 'visible',
          },
        },
      }}
    >
      {/* Modified indicator */}
      {isModified && (
        <Box
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        />
      )}

      {/* Label */}
      <Tooltip title={description || ''} placement="left" arrow enterDelay={500}>
        <Typography
          variant="body2"
          sx={{
            width: '35%',
            fontSize: '0.8125rem',
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'default',
            fontWeight: isModified ? 500 : 400,
          }}
        >
          {label}
        </Typography>
      </Tooltip>

      {/* Control */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {children}

        {/* Reset button (visible on hover) */}
        {isModified && onReset && (
          <IconButton
            className="reset-button"
            size="small"
            onClick={onReset}
            sx={{
              visibility: 'hidden',
              width: 20,
              height: 20,
              p: 0.25,
            }}
          >
            <RefreshIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
});

export default FieldRow;
