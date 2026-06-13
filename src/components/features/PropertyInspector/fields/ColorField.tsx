'use client';

import { Popover } from '@heroui/react';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useFieldParam } from '@/components/features/PropertyInspector/fields/useFieldParam';

interface ColorFieldProps {
  componentKey: string;
  paramKey: string;
  label: string;
  description: string;
}

const ColorField = memo(function ColorField({
  componentKey,
  paramKey,
  label,
  description,
}: ColorFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { value, isModified, set, reset } = useFieldParam<string>(componentKey, paramKey);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => set(e.target.value), [set]);

  const currentValue = value ?? '#000000';

  return (
    <FieldRow description={description} isModified={isModified} onReset={reset}>
      <div className="flex items-center justify-between h-10 flex-1">
        <span className="text-xs text-foreground">{label}</span>
        <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger>
            <div
              className="w-5 h-5 border border-border rounded cursor-pointer shrink-0 hover:border-border-secondary transition-colors"
              style={{ backgroundColor: currentValue }}
            />
          </Popover.Trigger>
          <Popover.Content placement="left" offset={10}>
            <Popover.Dialog>
              <div className="p-3">
                <HexColorPicker color={currentValue} onChange={set} />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={handleInput}
                    className="flex-1 px-2 py-1 text-xs bg-surface-secondary border border-border rounded focus:outline-none focus:border-accent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
    </FieldRow>
  );
});

export default ColorField;
