'use client';

import { MenuItem, TextField } from '@mui/material';
import React, { memo } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useComponentsStore } from '@/store/componentsStore';

interface SelectFieldProps {
  componentKey: string;
  paramKey: string;
  label: string;
  description: string;
  items?: string[];
}

const SelectField = memo(function SelectField({
  componentKey,
  paramKey,
  label,
  description,
  items = [],
}: SelectFieldProps) {
  const value = useComponentsStore(
    state => state.componentInstances[componentKey]?.pending[paramKey] as string | undefined
  );
  const committedValue = useComponentsStore(
    state => state.componentInstances[componentKey]?.committed[paramKey] as string | undefined
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const clearChanges = useComponentsStore(state => state.clearChanges);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateParameter(componentKey, paramKey, event.target.value);
  };

  const handleReset = () => {
    clearChanges(componentKey);
  };

  return (
    <FieldRow label={label} description={description} isModified={isModified} onReset={handleReset}>
      <TextField
        select
        value={value}
        onChange={handleChange}
        size="small"
        variant="outlined"
        sx={{
          minWidth: 100,
          '& .MuiOutlinedInput-root': {
            height: 28,
            fontSize: '0.8125rem',
          },
        }}
      >
        {items.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </FieldRow>
  );
});

export default SelectField;
