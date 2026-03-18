'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  type RefObject,
} from 'react';

interface ProgressBarProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  duration: number;
  onSeek: (time: number) => void;
  isDragging: RefObject<boolean>;
}

const LONG_PRESS_DELAY = 500;

export const ProgressBar = React.memo(function ProgressBar({
  videoRef,
  duration,
  isDragging,
  onSeek,
}: ProgressBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const seekRafRef = useRef<number>(null);
  const animRafRef = useRef<number>(null);

  useEffect(() => {
    const loop = () => {
      if (!isDragging.current && videoRef.current && duration > 0) {
        const p = (videoRef.current.currentTime / duration) * 100;
        if (fillRef.current) fillRef.current.style.width = `${p}%`;
        if (handleRef.current) handleRef.current.style.left = `${p}%`;
      }
      animRafRef.current = requestAnimationFrame(loop);
    };
    animRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRafRef.current ?? 0);
  }, [videoRef, duration, isDragging]);

  // 진행바 기준으로 퍼센트 계산
  const calcPercent = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }, []);

  const applyDrag = useCallback(
    (clientX: number) => {
      const p = calcPercent(clientX);
      if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;
      if (handleRef.current) handleRef.current.style.left = `${p * 100}%`;

      if (seekRafRef.current) cancelAnimationFrame(seekRafRef.current);
      seekRafRef.current = requestAnimationFrame(() => {
        onSeek(p * duration);
      });
    },
    [calcPercent, duration, onSeek],
  );

  const handlePressStart = useCallback(
    (clientX: number) => {
      isDragging.current = true;
      applyDrag(clientX);
      longPressTimer.current = setTimeout(
        () => setIsExpanded(true),
        LONG_PRESS_DELAY,
      );
    },
    [isDragging, applyDrag],
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging.current) return;
      applyDrag(clientX);
    },
    [isDragging, applyDrag],
  );

  const handleRelease = useCallback(() => {
    clearTimeout(longPressTimer.current ?? undefined);
    if (seekRafRef.current) cancelAnimationFrame(seekRafRef.current);
    isDragging.current = false;
    setIsExpanded(false);
  }, [isDragging]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleRelease();
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current) e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleRelease();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleMove, handleRelease, isDragging]);

  return (
    <div
      className={`relative w-full cursor-pointer px-3 transition-[padding] duration-200 ${
        isExpanded ? 'py-5' : 'py-3'
      }`}
      onMouseDown={(e) => handlePressStart(e.clientX)}
      onTouchStart={(e) => handlePressStart(e.touches[0].clientX)}
    >
      {/* 진행바 */}
      <div
        ref={trackRef}
        className={`relative rounded-full bg-white/30 transition-[height] duration-200 ${
          isExpanded ? 'h-4' : 'h-2.5'
        }`}
      >
        <div
          ref={fillRef}
          className="bg-primary-500 absolute top-0 left-0 h-full rounded-full"
        />

        {/* 핸들 */}
        <div
          ref={handleRef}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-[width,height] duration-200 ${
            isExpanded ? 'h-6 w-6' : 'h-4 w-4'
          }`}
        />
      </div>
    </div>
  );
});
