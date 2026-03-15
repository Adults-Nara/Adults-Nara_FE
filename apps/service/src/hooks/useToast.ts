import { useToastStore } from '@/store/useToastStore';

export const useToast = {
  success: (msg: string) => useToastStore.getState().addToast(msg, 'success'),

  error: (msg: string) => useToastStore.getState().addToast(msg, 'error'),

  info: (msg: string) => useToastStore.getState().addToast(msg, 'info'),
};
