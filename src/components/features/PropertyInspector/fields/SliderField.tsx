'use client';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, IconButton, Slider, Tooltip, Typography } from '@mui/material';
import React, { memo } from 'react';

import { useComponentsStore } from '@/store/componentsStore';

interface SliderFieldProps {
  componentKey: string;
  paramKey: string;
  label: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
}

const SliderField = memo(function SliderField({
  componentKey,
  paramKey,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
}: SliderFieldProps) {
  const value = useComponentsStore(
    state => state.componentInstances[componentKey]?.pending[paramKey] as number | undefined
  );
  const committedValue = useComponentsStore(
    state => state.componentInstances[componentKey]?.committed[paramKey] as number | undefined
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const clearChanges = useComponentsStore(state => state.clearChanges);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const finalValue = typeof newValue === 'number' ? newValue : newValue[0];
    updateParameter(componentKey, paramKey, finalValue);
  };

  const handleReset = () => {
    clearChanges(componentKey);
  };

  const currentValue = value ?? min;
  const decimals = step < 1 ? Math.max(1, -Math.floor(Math.log10(step))) : 0;

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.75,
        minHeight: 48,
        '&:hover': {
          bgcolor: 'action.hover',
          '& .reset-button': {
            visibility: 'visible',
          },
        },
      }}
    >
      {/* Level 1: Label + Value + Reset */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.5,
        }}
      >
        <Tooltip title={description || ''} placement="left" arrow enterDelay={500}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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

            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8125rem',
                color: 'text.primary',
                fontWeight: isModified ? 500 : 400,
                cursor: 'default',
              }}
            >
              {label}
            </Typography>
          </Box>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8125rem',
              color: 'primary.main',
              fontWeight: 500,
              minWidth: 40,
              textAlign: 'right',
            }}
          >
            {currentValue.toFixed(decimals)}
          </Typography>

          {/* Reset button (visible on hover) */}
          {isModified && (
            <IconButton
              className="reset-button"
              size="small"
              onClick={handleReset}
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

      {/* Level 2: Min + Slider + Max */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: isModified ? 1.25 : 0,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6875rem',
            color: 'text.disabled',
            minWidth: 32,
          }}
        >
          {min}
        </Typography>

        <Slider
          size="small"
          value={currentValue}
          onChange={handleSliderChange}
          step={step}
          min={min}
          max={max}
          valueLabelDisplay="off"
          sx={{ flex: 1 }}
        />

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6875rem',
            color: 'text.disabled',
            minWidth: 32,
            textAlign: 'right',
          }}
        >
          {max}
        </Typography>
      </Box>
    </Box>
  );
});

export default SliderField;
