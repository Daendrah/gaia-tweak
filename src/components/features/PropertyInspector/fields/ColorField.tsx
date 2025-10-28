'use client';

import { Box, TextField } from '@mui/material';
import React, { memo, useRef } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useComponentsStore } from '@/store/componentsStore';

interface ColorFieldProps {
  componentKey: string;
  paramKey: string;
  label: string;
  description: string;
}

const ColorField = memo(function ColorField({
  componentKey,
  paramKey,
  label,
  description,
}: ColorFieldProps) {
  const value = useComponentsStore(
    state => state.componentInstances[componentKey]?.pending[paramKey] as string | undefined
  );
  const committedValue = useComponentsStore(
    state => state.componentInstances[componentKey]?.committed[paramKey] as string | undefined
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const clearChanges = useComponentsStore(state => state.clearChanges);

  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateParameter(componentKey, paramKey, event.target.value);
  };

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hex = event.target.value;

    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      updateParameter(componentKey, paramKey, hex);
    }
  };

  const handlePreviewClick = () => {
    colorInputRef.current?.click();
  };

  const handleReset = () => {
    clearChanges(componentKey);
  };

  const currentValue = value ?? '#000000';

  return (
    <FieldRow label={label} description={description} isModified={isModified} onReset={handleReset}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Color preview (clickable) */}
        <Box
          onClick={handlePreviewClick}
          sx={{
            width: 24,
            height: 24,
            bgcolor: currentValue,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            flexShrink: 0,
            '&:hover': {
              borderColor: 'text.secondary',
            },
          }}
        />

        {/* Hex input */}
        <TextField
          value={currentValue}
          onChange={handleHexChange}
          size="small"
          variant="outlined"
          placeholder="#000000"
          sx={{
            width: 90,
            '& .MuiOutlinedInput-root': {
              height: 28,
              fontSize: '0.75rem',
              fontFamily: 'monospace',
            },
          }}
        />

        {/* Hidden native color picker */}
        <input
          ref={colorInputRef}
          type="color"
          value={currentValue}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </Box>
    </FieldRow>
  );
});

export default ColorField;
