import { useConfirmStore } from '@/store/useConfirmStore';

export function confirm(message: string, button: string) {
  return new Promise<boolean>((resolve) => {
    useConfirmStore.getState().open(message, button, resolve);
  });
}
