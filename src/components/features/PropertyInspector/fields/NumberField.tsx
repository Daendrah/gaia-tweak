'use client';

import { Input } from '@heroui/react';
import React, { memo, useCallback } from 'react';

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
    useCallback(
      state => state.componentInstances[componentKey]?.pending[paramKey] as number | undefined,
      [componentKey, paramKey]
    )
  );
  const committedValue = useComponentsStore(
    useCallback(
      state => state.componentInstances[componentKey]?.committed[paramKey] as number | undefined,
      [componentKey, paramKey]
    )
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const resetParameter = useComponentsStore(state => state.resetParameter);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value === '' ? 0 : Number(e.target.value);
      updateParameter(componentKey, paramKey, newValue);
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
        <Input
          type="number"
          value={String(value)}
          onChange={handleChange}
          size="sm"
          radius="sm"
          classNames={{
            base: 'w-20',
            input: 'text-xs',
            inputWrapper: 'h-6 min-h-6',
          }}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </FieldRow>
  );
});

export default NumberField;
