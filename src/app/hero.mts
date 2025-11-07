import { heroui } from '@heroui/react';
import colors from 'tailwindcss/colors';

export default heroui({
  themes: {
    light: {
      extend: 'light',
      colors: {},
    },
    dark: {
      extend: 'dark',
      colors: {
        background: '#18181B',
        primary: { DEFAULT: '#0ea5e9' },
        secondary: { DEFAULT: '#9333ea' },
        success: { DEFAULT: '#10b981' },
        warning: { DEFAULT: '#f59e0b' },
        danger: { DEFAULT: '#e11d48' },
      },
    },
  },
});
