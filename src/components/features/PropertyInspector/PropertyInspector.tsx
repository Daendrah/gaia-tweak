'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { memo, useState } from 'react';

import { PropertyField } from '@/components/features/PropertyInspector/fields/PropertyField';
import { componentRegistry } from '@/lib/world/componentRegistry';
import { useUIStore } from '@/store/uiStore';
import { ParameterDefinition } from '@/types/worldTypes';

export function PropertyInspector() {
  const selectedComponentKey = useUIStore(state => state.selectedComponentKey);

  if (!selectedComponentKey) {
    return null;
  }

  const componentDefinition = componentRegistry.getDefinition(selectedComponentKey);

  if (!componentDefinition) {
    return null;
  }

  const { paramsBySection } = componentDefinition;
  const sections = Object.keys(paramsBySection);

  if (sections.length === 0) {
    return null;
  }

  return (
    <Accordion
      selectionMode="multiple"
      variant="light"
      defaultSelectedKeys={sections}
      keepContentMounted={true}
      className="px-0"
    >
      {sections.map(sectionKey => {
        const params = paramsBySection[sectionKey];

        return (
          <AccordionItem
            key={sectionKey}
            title={sectionKey}
            aria-label={sectionKey}
            indicator={({ isOpen }) => (
              <ChevronDown
                size={20}
                className="transition-transform"
                style={{
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                }}
              />
            )}
            classNames={{
              heading: 'hover:bg-default-100 p-2',
              trigger: 'p-0 flex-row-reverse',
            }}
          >
            {params.map(definition => (
              <PropertyField
                key={definition.key}
                componentKey={selectedComponentKey}
                paramKey={definition.key}
                definition={definition}
              />
            ))}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
