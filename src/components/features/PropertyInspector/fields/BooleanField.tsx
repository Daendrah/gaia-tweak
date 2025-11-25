'use client';

import { Switch } from '@heroui/react';
import React, { memo, useCallback } from 'react';

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
    useCallback(
      state => state.componentInstances[componentKey]?.pending[paramKey] as boolean | undefined,
      [componentKey, paramKey]
    )
  );
  const committedValue = useComponentsStore(
    useCallback(
      state => state.componentInstances[componentKey]?.committed[paramKey] as boolean | undefined,
      [componentKey, paramKey]
    )
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const resetParameter = useComponentsStore(state => state.resetParameter);

  const handleChange = useCallback(
    (checked: boolean) => {
      updateParameter(componentKey, paramKey, checked);
    },
    [updateParameter, componentKey, paramKey]
  );

  const handleReset = useCallback(() => {
    resetParameter(componentKey, paramKey);
  }, [resetParameter, componentKey, paramKey]);

  return (
    <FieldRow description={description} isModified={isModified} onReset={handleReset}>
      <div className="flex items-center justify-between h-10 flex-1">
        <span className="text-xs text-foreground">{label}</span>
        <Switch size="sm" isSelected={value} onValueChange={handleChange} aria-label={label} />
      </div>
    </FieldRow>
  );
});

export default BooleanField;
