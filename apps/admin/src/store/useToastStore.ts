import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const TOAST_DURATION = 3000;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message, type) => {
    const { toasts } = get();

    // duplicate 방지
    if (toasts.some((t) => t.message === message)) return;

    const id = crypto.randomUUID();

    set({
      toasts: [...toasts, { id, message, type }],
    });

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, TOAST_DURATION);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
