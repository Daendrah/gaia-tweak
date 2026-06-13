'use client';

import { Switch } from '@heroui/react';
import { memo } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useFieldParam } from '@/components/features/PropertyInspector/fields/useFieldParam';

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
  const { value, isModified, set, reset } = useFieldParam<boolean>(componentKey, paramKey);

  return (
    <FieldRow description={description} isModified={isModified} onReset={reset}>
      <div className="flex items-center justify-between h-10 flex-1">
        <span className="text-xs text-foreground">{label}</span>
        <Switch isSelected={value} onChange={set} aria-label={label} size="sm">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </div>
    </FieldRow>
  );
});

export default BooleanField;
