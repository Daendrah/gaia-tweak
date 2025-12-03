'use client';

import { ComponentPalette } from '@/components/features/ComponentPalette/ComponentPalette';
import { AppLogo } from '@/components/layout/Sidebar/AppLogo';
import { SidebarFooter } from '@/components/layout/Sidebar/SidebarFooter';

export function Sidebar() {
  return (
    <div className="w-14 flex flex-col items-center bg-background py-2">
      <AppLogo />
      <ComponentPalette />
      <SidebarFooter />
    </div>
  );
}
