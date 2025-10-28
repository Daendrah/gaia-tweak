'use client';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Stack, Typography } from '@mui/material';
import React, { memo, useState } from 'react';

import PropertyField from '@/components/features/PropertyInspector/fields/PropertyField';
import { componentRegistry } from '@/lib/world/componentRegistry';
import { useUIStore } from '@/store/uiStore';
import { ParameterDefinition } from '@/types/worldTypes';

const SectionHeader = memo(function SectionHeader({
  sectionKey,
  expanded,
  onToggle,
}: {
  sectionKey: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        cursor: 'pointer',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        userSelect: 'none',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {/* Gutter zone for collapse icon */}
      <Box
        sx={{
          width: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          py: 0.5,
        }}
      >
        {expanded ? (
          <ExpandMoreIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        ) : (
          <ExpandLessIcon
            fontSize="small"
            sx={{
              color: 'text.secondary',
              transform: 'rotate(-90deg)',
            }}
          />
        )}
      </Box>

      {/* Title aligned with field labels */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          fontSize: '0.8125rem',
          color: 'text.primary',
          py: 0.75,
          px: 1.25,
        }}
      >
        {sectionKey}
      </Typography>
    </Box>
  );
});

const PropertySection = memo(function PropertySection({
  sectionKey,
  params,
  componentKey,
  defaultExpanded = true,
}: {
  sectionKey: string;
  params: ParameterDefinition[];
  componentKey: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box>
      <SectionHeader
        sectionKey={sectionKey}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      />

      {/* Field padding for alignment with gutter */}
      {expanded && (
        <Stack spacing={0}>
          {params.map(definition => (
            <Box key={definition.key} sx={{ pl: 3 }}>
              {' '}
              {/* 24px gutter padding */}
              <PropertyField
                componentKey={componentKey}
                paramKey={definition.key}
                definition={definition}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
});

export default function InspectorList() {
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
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      {sections.map(sectionKey => (
        <PropertySection
          key={sectionKey}
          sectionKey={sectionKey}
          params={paramsBySection[sectionKey]}
          componentKey={selectedComponentKey}
          defaultExpanded={true}
        />
      ))}
    </Box>
  );
}
