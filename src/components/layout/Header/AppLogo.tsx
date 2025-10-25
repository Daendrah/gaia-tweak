'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

export default function AppLogo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Logo SVG */}
      <Box
        component="svg"
        viewBox="0 0 32 32"
        sx={{
          height: 32,
          width: 32,
          color: theme => theme.palette.primary.main,
          fill: theme => theme.palette.primary.main,
        }}
        aria-hidden="true"
      >
        <circle cx="22" cy="10" r="2.2" />
        <path
          d="M6 23 L13 13 L20 23"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 23 L17.5 18 L19 20.5 L21 17 L25 23"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>

      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Gaia Tweak
      </Typography>
    </Box>
  );
}
