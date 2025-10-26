import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ComponentDefinition {
  name: string;
  icon: React.ElementType;
}

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

  // World Component Management
  selectedComponentKey: string | null;
  componentDefinitions: Map<string, ComponentDefinition>;
  selectComponent: (key: string | null) => void;
  addWorldComponent: (key: string, name: string, icon: React.ElementType) => void;
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
  selectedComponentKey: null,
  componentDefinitions: new Map<string, ComponentDefinition>(),

  toggleSettingsPanelState: (open: boolean) => {
    if (open) get().selectComponent(null);
    set({ settingsPanelOpened: open });
  },

  initializeTheme: () => {
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

  selectComponent: (key: string | null) => {
    if (key !== null) get().toggleSettingsPanelState(false);
    set({ selectedComponentKey: key });
  },

  addWorldComponent: (key, name, icon) => {
    const definitions = get().componentDefinitions;
    if (definitions.get(key)) return;
    definitions.set(key, { name, icon });
    set({
      componentDefinitions: new Map(definitions),
    });
  },
}));
