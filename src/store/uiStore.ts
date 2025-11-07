import { create } from 'zustand';

interface UIState {
  settingsPanelOpened: boolean;
  toggleSettingsPanelState: (open: boolean) => void;

  selectedComponentKey: string | null;
  selectComponent: (key: string | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  settingsPanelOpened: false,
  selectedComponentKey: null,

  toggleSettingsPanelState: (open: boolean) => {
    if (open) get().selectComponent(null);
    set({ settingsPanelOpened: open });
  },

  selectComponent: (key: string | null) => {
    if (key !== null) get().toggleSettingsPanelState(false);
    set({ selectedComponentKey: key });
  },
}));
