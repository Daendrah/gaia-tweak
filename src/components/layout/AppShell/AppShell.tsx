'use client';

import { PropertyPanel } from '@/components/layout/PropertyPanel/PropertyPanel';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Viewport } from '@/components/layout/Viewport/Viewport';

export function AppShell() {
  return (
    <div className="flex flex-row w-screen h-screen  text-sm">
      <Sidebar />
      <Viewport />
      <PropertyPanel />
    </div>
  );
}
