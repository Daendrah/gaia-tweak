'use client';

import { memo } from 'react';

import BooleanField from '@/components/features/PropertyInspector/fields/BooleanField';
import ColorField from '@/components/features/PropertyInspector/fields/ColorField';
import NumberField from '@/components/features/PropertyInspector/fields/NumberField';
import SelectField from '@/components/features/PropertyInspector/fields/SelectField';
import SliderField from '@/components/features/PropertyInspector/fields/SliderField';
import { ParameterDefinition, ParameterType } from '@/types/worldTypes';

interface PropertyFieldProps {
  componentKey: string;
  paramKey: string;
  definition: ParameterDefinition;
}

export const PropertyField = memo(function PropertyField({
  componentKey,
  paramKey,
  definition,
}: PropertyFieldProps) {
  switch (definition.type) {
    case ParameterType.SLIDER:
      return (
        <SliderField
          componentKey={componentKey}
          paramKey={paramKey}
          label={definition.label}
          description={definition.description}
          min={definition.min}
          max={definition.max}
          step={definition.step}
        />
      );

    case ParameterType.NUMBER:
      return (
        <NumberField
          componentKey={componentKey}
          paramKey={paramKey}
          label={definition.label}
          description={definition.description}
          min={definition.min}
          max={definition.max}
          step={definition.step}
        />
      );

    case ParameterType.COLOR:
      return (
        <ColorField
          componentKey={componentKey}
          paramKey={paramKey}
          label={definition.label}
          description={definition.description}
        />
      );

    case ParameterType.BOOLEAN:
      return (
        <BooleanField
          componentKey={componentKey}
          paramKey={paramKey}
          label={definition.label}
          description={definition.description}
        />
      );

    case ParameterType.SELECT:
      return (
        <SelectField
          componentKey={componentKey}
          paramKey={paramKey}
          label={definition.label}
          description={definition.description}
          items={definition.items}
        />
      );

    default:
      return null;
  }
});
