'use client';

import { Slider } from '@heroui/react';
import React, { memo, useCallback } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
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
  // Sélecteurs optimisés
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

  // Callbacks mémoïsés
  const handleSliderChange = useCallback(
    (value: number | number[]) => {
      const finalValue = typeof value === 'number' ? value : value[0];
      updateParameter(componentKey, paramKey, finalValue);
    },
    [updateParameter, componentKey, paramKey]
  );

  const handleReset = useCallback(() => {
    resetParameter(componentKey, paramKey);
  }, [resetParameter, componentKey, paramKey]);

  const currentValue = value ?? min;

  return (
    <FieldRow description={description} isModified={isModified} onReset={handleReset}>
      <div className="flex items-center h-14 flex-1">
        <Slider
          label={label}
          aria-label={label}
          size="sm"
          value={currentValue}
          onChange={handleSliderChange}
          step={step}
          minValue={min}
          maxValue={max}
          className="flex-1"
          classNames={{
            base: 'max-w-full',
            label: 'text-xs',
            value: 'text-xs',
          }}
        />
      </div>
    </FieldRow>
  );
});

export default SliderField;
