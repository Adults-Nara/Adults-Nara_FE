import { create } from 'zustand';
import { ReactNode } from 'react';

interface SheetState {
  isOpen: boolean;
  title: string | null;
  content: ReactNode | null;

  open: (title: string, content: ReactNode) => void;
  close: () => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  title: null,
  content: null,
  open: (title, content) => set({ isOpen: true, title, content }),
  close: () => set({ isOpen: false, title: null, content: null }),
}));
