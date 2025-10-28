'use client';

import { Switch } from '@mui/material';
import React, { memo } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useComponentsStore } from '@/store/componentsStore';

interface BooleanFieldProps {
  componentKey: string;
  paramKey: string;
  label: string;
  description: string;
}

const BooleanField = memo(function BooleanField({
  componentKey,
  paramKey,
  label,
  description,
}: BooleanFieldProps) {
  const value = useComponentsStore(
    state => state.componentInstances[componentKey]?.pending[paramKey] as boolean | undefined
  );
  const committedValue = useComponentsStore(
    state => state.componentInstances[componentKey]?.committed[paramKey] as boolean | undefined
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const clearChanges = useComponentsStore(state => state.clearChanges);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateParameter(componentKey, paramKey, event.target.checked);
  };

  const handleReset = () => {
    clearChanges(componentKey);
  };

  return (
    <FieldRow label={label} description={description} isModified={isModified} onReset={handleReset}>
      <Switch checked={value} onChange={handleChange} size="small" />
    </FieldRow>
  );
});

export default BooleanField;
