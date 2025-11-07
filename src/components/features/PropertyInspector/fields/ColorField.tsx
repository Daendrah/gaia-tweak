'use client';

import React, { memo, useCallback, useMemo } from 'react';

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
  // Sélecteurs optimisés : seulement les valeurs nécessaires, pas l'objet entier
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

  // Callbacks mémoïsés pour éviter les re-renders de FieldRow
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateParameter(componentKey, paramKey, event.target.value);
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
        <div
          className="w-5 h-5 border border-divider rounded cursor-pointer shrink-0 hover:border-default-500"
          style={{ backgroundColor: currentValue }}
        >
          <input
            type="color"
            value={currentValue}
            onChange={handleChange}
            className="w-full h-full opacity-0 cursor-pointer"
            style={{
              padding: 0,
            }}
          />
        </div>
      </div>
    </FieldRow>
  );
});

export default ColorField;
