import { ParameterValue } from '@/types/worldTypes';

export function getParameterValue<T extends ParameterValue>(
  params: Record<string, ParameterValue>,
  key: string,
  defaultValue: T
): T {
  const value = params[key];
  if (typeof value === typeof defaultValue) {
    return value as T;
  }

  return defaultValue;
}
