'use client';

import { useEffect, useRef, useState } from 'react';
import Thumbnail from '@/components/thumbnail/Thumbnail';
import { NextVideoInfo } from '@/hooks/usePlaylistAutoPlay';

interface NextVideoOverlayProps {
  nextVideo: NextVideoInfo;
  onNavigate: () => void;
  onReplay: () => void;
}

const COUNTDOWN_SECONDS = 10;

export function NextVideoOverlay({
  nextVideo,
  onNavigate,
  onReplay,
}: NextVideoOverlayProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current ?? undefined);
          onNavigate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current ?? undefined);
  }, [onNavigate]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-around bg-black/70 px-6">
      {/* 다시보기 */}
      <button
        type="button"
        onClick={onReplay}
        className="flex flex-col items-center gap-2 text-white"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </div>
        <span className="body3">다시보기</span>
      </button>

      {/* 다음 영상 카드 */}
      <button
        type="button"
        onClick={onNavigate}
        className="flex w-44 flex-col overflow-hidden rounded-lg shadow-lg transition hover:scale-105 active:scale-100"
      >
        <div className="relative w-full rounded-lg">
          <Thumbnail src={nextVideo.thumbnailUrl} type="long" />
          {/* 카운트다운 배지 */}
          <div className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-sm font-bold text-white">
            {countdown}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 bg-white p-2 text-left">
          <span className="title3 line-clamp-2 leading-tight font-medium text-gray-900">
            {nextVideo.title}
          </span>
          <span className="body4 text-gray-500">{nextVideo.uploader}</span>
        </div>
      </button>
    </div>
  );
}
