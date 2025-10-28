'use client';

import { TextField } from '@mui/material';
import React, { memo } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useComponentsStore } from '@/store/componentsStore';

interface NumberFieldProps {
  componentKey: string;
  paramKey: string;
  label: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
}

const NumberField = memo(function NumberField({
  componentKey,
  paramKey,
  label,
  description,
  min,
  max,
  step,
}: NumberFieldProps) {
  const value = useComponentsStore(
    state => state.componentInstances[componentKey]?.pending[paramKey] as number | undefined
  );
  const committedValue = useComponentsStore(
    state => state.componentInstances[componentKey]?.committed[paramKey] as number | undefined
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const clearChanges = useComponentsStore(state => state.clearChanges);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    updateParameter(componentKey, paramKey, newValue);
  };

  const handleReset = () => {
    clearChanges(componentKey);
  };

  return (
    <FieldRow label={label} description={description} isModified={isModified} onReset={handleReset}>
      <TextField
        type="number"
        value={value}
        onChange={handleChange}
        size="small"
        variant="outlined"
        sx={{
          width: 100,
          '& .MuiOutlinedInput-root': {
            height: 28,
            fontSize: '0.8125rem',
          },
        }}
        slotProps={{
          input: {
            min: min,
            max: max,
            step: step,
          },
        }}
      />
    </FieldRow>
  );
});

export default NumberField;
