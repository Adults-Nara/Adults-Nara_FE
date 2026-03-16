import { create } from 'zustand';
import { ReactNode } from 'react';

interface SheetState {
  isOpen: boolean;
  title: string | null;
  content: ReactNode | null;
  bgBlack: boolean;

  open: (title: string, content: ReactNode, bgBlack?: boolean) => void;
  close: () => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  title: null,
  content: null,
  bgBlack: true,
  open: (title, content, bgBlack = true) =>
    set({ isOpen: true, title, content, bgBlack }),
  close: () => set({ isOpen: false, title: null, content: null }),
}));
