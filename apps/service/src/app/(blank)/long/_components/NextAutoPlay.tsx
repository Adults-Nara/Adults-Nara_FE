'use client';

import { useEffect, useState } from 'react';
import { ThumbnailData } from '@/types/video';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import { RotateCcw } from 'lucide-react';

interface NextAutoPlayProps {
  nextVideo: ThumbnailData;
  onNavigate: () => void;
  onReplay: () => void;
}

const COUNTDOWN_SECONDS = 10;

export function NextAutoPlay({
  nextVideo,
  onNavigate,
  onReplay,
}: NextAutoPlayProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) onNavigate();
  }, [countdown, onNavigate]);

  return (
    <div className="flex items-center gap-6">
      {/* 다시보기 */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onReplay();
        }}
        className="flex flex-col items-center gap-2 text-white"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
          <RotateCcw />
        </div>
        <span className="body3">다시보기</span>
      </button>

      {/* 다음 영상 카드 */}
      <div
        aria-label="next-video-button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        className="relative w-40 transition hover:scale-105 active:scale-100"
      >
        <VideoVerticalCard data={nextVideo} />
        <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-sm font-bold text-white">
          {countdown}
        </div>
      </div>
    </div>
  );
}
