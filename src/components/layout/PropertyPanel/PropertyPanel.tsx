'use client';

import { Drawer, DrawerBody } from '@heroui/react';

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
      isOpen={selectedComponentKey !== null}
      onOpenChange={open => {
        if (!open) selectComponent(null);
      }}
    >
      <Drawer.Backdrop variant="transparent" isDismissable={false} className="pointer-events-none">
        <Drawer.Content placement="right" className="pointer-events-none py-2">
          <Drawer.Dialog className="pointer-events-auto p-0">
            <PropertyPanelHeader />
            <Drawer.Body className="p-0">
              <PropertyInspector />
            </Drawer.Body>
            <PropertyPanelFooter />
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
