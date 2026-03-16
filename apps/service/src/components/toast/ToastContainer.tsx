'use client';

import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import ToastItem from './ToastItem';

export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="pointer-events-none fixed top-20 left-1/2 z-50 flex w-full max-w-95 -translate-x-1/2 flex-col gap-2 px-10">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </AnimatePresence>
    </div>
  );
}
