'use client';

import { Accordion } from '@heroui/react';
import { ChevronDown } from 'lucide-react';

import PropertyField from '@/components/features/PropertyInspector/fields/PropertyField';
import { componentRegistry } from '@/lib/world/componentRegistry';
import { useUIStore } from '@/store/uiStore';

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
    <Accordion defaultExpandedKeys={sections} allowsMultipleExpanded className="px-0">
      {sections.map(sectionKey => {
        const params = paramsBySection[sectionKey];

        return (
          <Accordion.Item key={sectionKey} id={sectionKey}>
            <Accordion.Heading>
              <Accordion.Trigger className="group w-full flex items-center justify-between p-2 hover:bg-surface-secondary">
                <span>{sectionKey}</span>
                <ChevronDown
                  size={20}
                  className="transition-transform group-data-[expanded]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              {params.map(definition => (
                <PropertyField
                  key={definition.key}
                  componentKey={selectedComponentKey}
                  paramKey={definition.key}
                  definition={definition}
                />
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
