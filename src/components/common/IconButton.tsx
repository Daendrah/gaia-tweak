import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import React, { memo } from 'react';

interface IconButtonProps {
  onClick: () => void;
  tooltip: string;
  ariaLabel: string;
  icon: React.ReactNode;
  color?: 'inherit' | 'primary' | 'error';
  variant?: 'text' | 'outlined' | 'contained';
  size?: number;
}

const IconButton = memo(function IconButton(props: IconButtonProps) {
  const {
    onClick,
    tooltip,
    ariaLabel,
    icon,
    color = 'inherit',
    variant = 'text',
    size = 40,
  } = props;

  return (
    <Tooltip title={tooltip}>
      <Button
        onClick={onClick}
        aria-label={ariaLabel}
        color={color}
        variant={variant}
        sx={{ width: size, height: size, minWidth: 'auto', padding: 1 }}
      >
        {icon}
      </Button>
    </Tooltip>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
