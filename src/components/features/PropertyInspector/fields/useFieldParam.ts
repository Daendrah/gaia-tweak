import { useCallback } from 'react';

import { useComponentsStore } from '@/store/componentsStore';
import type { ParameterValue } from '@/types/worldTypes';

export function useFieldParam<T extends ParameterValue>(componentKey: string, paramKey: string) {
  const value = useComponentsStore(
    useCallback(
      state => state.componentInstances[componentKey]?.pending[paramKey] as T | undefined,
      [componentKey, paramKey]
    )
  );
  const committedValue = useComponentsStore(
    useCallback(
      state => state.componentInstances[componentKey]?.committed[paramKey] as T | undefined,
      [componentKey, paramKey]
    )
  );
  const updateParameter = useComponentsStore(state => state.updateParameter);
  const resetParameter = useComponentsStore(state => state.resetParameter);

  const set = useCallback(
    (v: T) => updateParameter(componentKey, paramKey, v),
    [updateParameter, componentKey, paramKey]
  );
  const reset = useCallback(
    () => resetParameter(componentKey, paramKey),
    [resetParameter, componentKey, paramKey]
  );

  return { value, isModified: value !== committedValue, set, reset };
}
