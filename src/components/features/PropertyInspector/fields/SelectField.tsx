'use client';

import { Select, SelectItem } from '@heroui/react';
import React, { memo, useCallback } from 'react';

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
  // Sélecteurs optimisés
  const value = useComponentsStore(
    useCallback(
      state => state.componentInstances[componentKey]?.pending[paramKey] as string | undefined,
      [componentKey, paramKey]
    )
  );
  const committedValue = useComponentsStore(
    useCallback(
      state => state.componentInstances[componentKey]?.committed[paramKey] as string | undefined,
      [componentKey, paramKey]
    )
  );
  const isModified = value !== committedValue;

  const updateParameter = useComponentsStore(state => state.updateParameter);
  const resetParameter = useComponentsStore(state => state.resetParameter);

  // Callbacks mémoïsés
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateParameter(componentKey, paramKey, e.target.value);
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
        <Select
          selectedKeys={value ? [value] : []}
          onChange={handleChange}
          size="sm"
          radius="sm"
          classNames={{
            base: 'min-w-24',
            trigger: 'h-6 min-h-6',
            value: 'text-xs',
          }}
        >
          {items.map(item => (
            <SelectItem key={item}>{item}</SelectItem>
          ))}
        </Select>
      </div>
    </FieldRow>
  );
});

export default SelectField;
