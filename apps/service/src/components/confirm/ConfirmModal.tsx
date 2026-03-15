'use client';

import { useConfirmStore } from '@/store/useConfirmStore';
import { Button } from '@repo/ui';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal() {
  const { isOpen, message, button, resolve, close } = useConfirmStore();

  const handleConfirm = () => {
    resolve?.(true);
    close();
  };

  const handleCancel = () => {
    resolve?.(false);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-fix max-w-70 rounded-xl bg-white px-8 py-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <p className="body2 mb-6 text-center">{message}</p>

            <div className="flex justify-end gap-2">
              <Button
                variant={'outline'}
                size={'lg'}
                onClick={handleCancel}
                className="w-full"
              >
                취소
              </Button>

              <Button size={'lg'} onClick={handleConfirm} className="w-full">
                {button}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
