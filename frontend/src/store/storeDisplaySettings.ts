import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DisplaySettings } from './types';

export const useStoreDisplaySettings = create<DisplaySettings>()(
  devtools(
    persist(
      (set) => ({
        isSidebarExpanded: true,
        setSidebarExpanded: (expanded) =>
          set(() => ({ isSidebarExpanded: expanded })),
        displayFile: '',
        setDisplayFile: (file: string) =>
          set(() => ({ displayFile: file })),
      }),
      {
        name: 'display-settings',
      },
    ),
  ),
);
