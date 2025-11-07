'use client';

import { Button, Tooltip } from '@heroui/react';
import { CircleQuestionMark, Moon, RotateCcw, Sun, WandSparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { memo, useCallback, useEffect, useState } from 'react';

import { useWorldStore } from '@/store/worldStore';

interface FooterButtonProps {
  icon: React.ElementType;
  label: string;
  color?: 'default' | 'primary' | 'danger';
  onClick: () => void;
}

const FooterButton = memo(function FooterButton(props: FooterButtonProps) {
  const { onClick, label, icon, color = 'default' } = props;

  return (
    <Tooltip
      key={label}
      color="default"
      content={label}
      placement={'right'}
      radius="sm"
      offset={15}
    >
      <Button
        aria-label={label}
        className="size-10"
        color={color}
        isIconOnly
        onPress={onClick}
        radius="sm"
        variant={'light'}
      >
        {React.createElement(icon, { size: 20 })}
      </Button>
    </Tooltip>
  );
});

export function SidebarFooter() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const generateAll = useWorldStore(state => state.generateAll);
  const clearAll = useWorldStore(state => state.clearAll);

  const openGitHub = useCallback(() => {
    window.open('https://github.com/Daendrah/gaia-tweak', '_blank');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center gap-2 py-2 mt-auto">
      <FooterButton
        icon={WandSparkles}
        color="primary"
        label="Generate All"
        onClick={generateAll}
      />
      <FooterButton icon={RotateCcw} color="danger" label="Reset All" onClick={clearAll} />
      <FooterButton onClick={openGitHub} label="Help" icon={CircleQuestionMark} />
      <FooterButton
        onClick={toggleTheme}
        label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        icon={theme === 'dark' ? Moon : Sun}
      />
    </div>
  );
}
