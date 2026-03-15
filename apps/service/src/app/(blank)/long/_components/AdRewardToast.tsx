'use client';

import { useEffect } from 'react';

interface AdRewardToastProps {
  onDismiss: () => void;
}

const TOAST_DURATION_MS = 3000;

export function AdRewardToast({ onDismiss }: AdRewardToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
    >
      🪙 포인트가 적립되었습니다!
    </div>
  );
}
