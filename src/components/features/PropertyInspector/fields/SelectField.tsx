'use client';

import { ListBox, ListBoxItem, Select } from '@heroui/react';
import { Key, memo, useCallback } from 'react';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useFieldParam } from '@/components/features/PropertyInspector/fields/useFieldParam';

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
  const { value, isModified, set, reset } = useFieldParam<string>(componentKey, paramKey);

  const handleChange = useCallback((key: Key) => set(String(key)), [set]);

  return (
    <FieldRow description={description} isModified={isModified} onReset={reset}>
      <div className="flex items-center justify-between h-10 flex-1">
        <span className="text-xs text-foreground">{label}</span>
        <Select
          aria-label={label}
          selectedKey={value ?? ''}
          onSelectionChange={handleChange}
          className="min-w-48 w-fit"
        >
          <Select.Trigger className="h-6 min-h-6 text-xs rounded-sm">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {items.map(item => (
                <ListBoxItem key={item} id={item}>
                  {item}
                </ListBoxItem>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
    </FieldRow>
  );
});

export default SelectField;
