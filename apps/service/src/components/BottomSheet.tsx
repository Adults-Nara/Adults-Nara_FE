'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { Close } from '@repo/ui';
import { useEffect } from 'react';

const BottomSheet = () => {
  const { isOpen, title, content, close } = useSheetStore();

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [close, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 어두운 배경 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 바텀시트 본체 */}
      <div className="z-10 flex w-full max-w-112.5 flex-col rounded-t-2xl bg-white pb-8">
        <div className="flex w-full flex-col gap-1 rounded-t-2xl border-b border-gray-300 bg-gray-100 px-5 py-3">
          <div className="mx-auto h-1 w-12 rounded-full bg-gray-400" />
          <div className="flex w-full justify-between">
            <span className="title2">{title}</span>
            <button type="button" onClick={() => close()}>
              <Close className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="min-h-150 overflow-y-auto">{content}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
