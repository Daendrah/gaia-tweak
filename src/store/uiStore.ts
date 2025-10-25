import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UIState {
  // Settings panel State
  settingsPanelOpened: boolean;
  toggleSettingsPanelState: (open: boolean) => void;

  // Theme Management
  themeMode: ThemeMode;
  isThemeInitialized: boolean;
  initializeTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
};

const getInitialTheme = (): ThemeMode => {
  const stored = getStoredTheme();
  if (stored) return stored;
  return getSystemTheme();
};

const storeTheme = (mode: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('theme', mode);
  } catch {
    console.warn('Failed to save theme preference');
  }
};

const applyThemeToDOM = (mode: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
};

export const useUIStore = create<UIState>((set, get) => ({
  settingsPanelOpened: false,
  themeMode: 'light',
  isThemeInitialized: false,

  toggleSettingsPanelState: (open: boolean) => {
    set({ settingsPanelOpened: open });
  },

  initializeTheme: () => {
    // Évite la double initialisation
    if (get().isThemeInitialized) return;

    const initialTheme = getInitialTheme();
    applyThemeToDOM(initialTheme);

    set({
      themeMode: initialTheme,
      isThemeInitialized: true,
    });
  },

  setThemeMode: (mode: ThemeMode) => {
    storeTheme(mode);
    applyThemeToDOM(mode);
    set({ themeMode: mode });
  },

  toggleThemeMode: () => {
    const currentMode = get().themeMode;
    const nextMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark';
    get().setThemeMode(nextMode);
  },
}));
