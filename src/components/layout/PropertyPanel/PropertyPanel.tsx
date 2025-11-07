'use client';

import { Drawer, DrawerBody, DrawerContent } from '@heroui/react';

import { PropertyInspector } from '@/components/features/PropertyInspector/PropertyInspector';
import { PropertyPanelFooter } from '@/components/layout/PropertyPanel/PropertyPanelFooter';
import { PropertyPanelHeader } from '@/components/layout/PropertyPanel/PropertyPanelHeader';
import { useUIStore } from '@/store/uiStore';

export function PropertyPanel() {
  const selectedComponentKey = useUIStore(state => state.selectedComponentKey);
  const selectComponent = useUIStore(state => state.selectComponent);
  if (!selectedComponentKey) {
    return null;
  }

  return (
    <Drawer
      radius="none"
      isDismissable={false}
      backdrop="transparent"
      placement="right"
      isOpen={selectedComponentKey !== null}
      size="md"
      hideCloseButton={true}
      classNames={{ wrapper: 'pointer-events-none', base: 'pointer-events-auto py-2' }}
      onClose={() => selectComponent(null)}
    >
      <DrawerContent>
        <PropertyPanelHeader />
        <DrawerBody className="p-0">
          <PropertyInspector />
        </DrawerBody>
        <PropertyPanelFooter />
      </DrawerContent>
    </Drawer>
  );
}
