'use client';

import React, { useRef, useEffect } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isDragging: React.RefObject<boolean>;
}

export const ProgressBar = React.memo(function ProgressBar({
  currentTime,
  duration,
  isDragging,
  onSeek,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackFillRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 위치 조정
  const updateBar = (p: number) => {
    if (trackFillRef.current) {
      trackFillRef.current.style.width = `${p}%`;
    }
    if (handleRef.current) {
      handleRef.current.style.left = `calc(${p}% - 8px)`;
    }
  };

  // 드래그 중이 아닐 때만 DOM 업데이트
  useEffect(() => {
    if (isDragging.current) return;
    updateBar(percent);
  }, [percent]);

  const calcPercent = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) * 100;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updateBar(calcPercent(e.clientX));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      onSeek((calcPercent(e.clientX) / 100) * duration);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      updateBar(calcPercent(e.touches[0].clientX));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      onSeek((calcPercent(e.changedTouches[0].clientX) / 100) * duration);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [duration, onSeek]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updateBar(calcPercent(e.clientX));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    updateBar(calcPercent(e.touches[0].clientX));
  };

  return (
    <div
      ref={trackRef}
      className="group w-full flex-1 cursor-pointer px-3 py-3"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative h-2.5 rounded-full bg-white/30">
        <div
          ref={trackFillRef}
          className="bg-primary-500 absolute top-0 left-0 h-full rounded-full"
          style={isDragging.current ? undefined : { width: `${percent}%` }}
        />
        <div
          ref={handleRef}
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow"
          style={
            isDragging.current ? undefined : { left: `calc(${percent}% - 8px)` }
          }
        />
      </div>
    </div>
  );
});
