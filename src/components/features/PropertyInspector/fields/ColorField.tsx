'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import React, { memo, useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import FieldRow from '@/components/features/PropertyInspector/fields/FieldRow';
import { useComponentsStore } from '@/store/componentsStore';

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

  const handleChange = useCallback(
    (newColor: string) => {
      updateParameter(componentKey, paramKey, newColor);
    },
    [updateParameter, componentKey, paramKey]
  );

  const handleReset = useCallback(() => {
    resetParameter(componentKey, paramKey);
  }, [resetParameter, componentKey, paramKey]);

  const currentValue = value ?? '#000000';

  return (
    <FieldRow description={description} isModified={isModified} onReset={handleReset}>
      <div className="flex items-center justify-between h-10 flex-1">
        <span className="text-xs text-foreground">{label}</span>
        <Popover
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          placement="left"
          offset={10}
          triggerScaleOnOpen={false}
        >
          <PopoverTrigger>
            <div
              className="w-5 h-5 border border-divider rounded cursor-pointer shrink-0 hover:border-default-500 transition-colors"
              style={{ backgroundColor: currentValue }}
            />
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <div className="p-3">
              <HexColorPicker color={currentValue} onChange={handleChange} />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={currentValue}
                  onChange={e => handleChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-default-100 border border-divider rounded focus:outline-none focus:border-primary"
                  placeholder="#000000"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </FieldRow>
  );
});

export default ColorField;
