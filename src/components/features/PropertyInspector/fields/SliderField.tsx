'use client';

import { Slider } from '@heroui/react';
import { memo, useCallback } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useFieldParam } from '@/components/features/PropertyInspector/fields/useFieldParam';

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
  const { value, isModified, set, reset } = useFieldParam<number>(componentKey, paramKey);

  const handleChange = useCallback(
    (v: number | number[]) => set(typeof v === 'number' ? v : v[0]),
    [set]
  );

  const currentValue = value ?? min;

  return (
    <FieldRow description={description} isModified={isModified} onReset={reset}>
      <div className="flex items-center h-14 flex-1">
        <Slider
          aria-label={label}
          value={currentValue}
          onChange={handleChange}
          step={step}
          minValue={min}
          maxValue={max}
          className="flex-1"
        >
          <div className="flex justify-between text-xs mb-1">
            <span>{label}</span>
            <Slider.Output />
          </div>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </div>
    </FieldRow>
  );
});

export default SliderField;
