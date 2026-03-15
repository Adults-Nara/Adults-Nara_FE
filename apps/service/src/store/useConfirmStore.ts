import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  message: string;
  button: string;
  resolve?: (value: boolean) => void;
  open: (
    message: string,
    button: string,
    resolve: (value: boolean) => void,
  ) => void;
  close: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  message: '',
  button: '',

  open: (message, button, resolve) =>
    set({
      isOpen: true,
      message,
      button,
      resolve,
    }),

  close: () =>
    set({
      isOpen: false,
      message: '',
      button: '',
      resolve: undefined,
    }),
}));
