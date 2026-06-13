'use client';

import { Input } from '@heroui/react';
import { ChangeEvent, memo, useCallback } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useFieldParam } from '@/components/features/PropertyInspector/fields/useFieldParam';

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
  const { value, isModified, set, reset } = useFieldParam<number>(componentKey, paramKey);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => set(e.target.value === '' ? 0 : Number(e.target.value)),
    [set]
  );

  return (
    <FieldRow description={description} isModified={isModified} onReset={reset}>
      <div className="flex items-center justify-between h-10 flex-1">
        <span className="text-xs text-foreground">{label}</span>
        <Input
          type="number"
          value={String(value)}
          onChange={handleChange}
          className="w-20 h-6 text-xs rounded-sm"
          min={min}
          max={max}
          step={step}
        />
      </div>
    </FieldRow>
  );
});

export default NumberField;
