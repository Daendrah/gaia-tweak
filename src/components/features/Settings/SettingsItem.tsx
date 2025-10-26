'use client';

import CardHeader from '@mui/material/CardHeader';
import Switch from '@mui/material/Switch';
import React from 'react';

import { useUIStore } from '@/store/uiStore';
import { useWorldStore } from '@/store/worldStore';

interface SettingsItemProps {
  componentKey: string;
}

function SettingsItem({ componentKey }: SettingsItemProps) {
  const componentDefinition = useUIStore(state => state.componentDefinitions.get(componentKey));
  const isActive = useWorldStore(state => state.componentInstances[componentKey]?.active ?? false);
  const buildComponent = useWorldStore(state => state.buildComponent);
  const resetComponent = useWorldStore(state => state.resetComponent);

  const handleToggle = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      if (checked) {
        buildComponent(componentKey);
      } else {
        resetComponent(componentKey);
      }
    },
    [componentKey, buildComponent, resetComponent]
  );

  if (!componentDefinition) {
    return null;
  }

  return (
    <CardHeader
      avatar={React.createElement(componentDefinition.icon, { fontSize: 'small' })}
      title={componentDefinition.name}
      action={<Switch checked={isActive} onChange={handleToggle} />}
    />
  );
}

export default React.memo(SettingsItem);
