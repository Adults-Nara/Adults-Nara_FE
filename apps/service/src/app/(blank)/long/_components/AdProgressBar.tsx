'use client';

import { formatVideoTime } from '@/utils/format';
import { Coin } from '@repo/ui';
import React, { useRef, useEffect } from 'react';

interface AdProgressBarProps {
  currentTime: number;
  duration: number;
}

// 광고 전용 읽기 전용 프로그레스 바.
// - 시킹(드래그/클릭) 완전 차단 (pointer-events-none)
// - 썸: 달리는 사람 아이콘
// - 트랙 끝: 코인 아이콘 (리워드 목표 표시)
export const AdProgressBar = React.memo(function AdProgressBar({
  currentTime,
  duration,
}: AdProgressBarProps) {
  const trackFillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (trackFillRef.current) {
      trackFillRef.current.style.width = `${percent}%`;
    }
    if (thumbRef.current) {
      thumbRef.current.style.left = `calc(${percent}% - 10px)`;
    }
  }, [percent]);

  return (
    // pointer-events-none: 클릭/드래그를 통한 시킹 완전 차단
    <div className="flex flex-col justify-start">
      <div className="body3 flex items-center justify-between px-4 pt-1">
        {/* 재생 시간 표시 */}
        <div className="w-fit text-white">
          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
        </div>
      </div>
      <div className="pointer-events-none w-full flex-1 px-3 py-3 select-none">
        <div className="relative h-2.5 rounded-full bg-white/30">
          {/* 진행 채움 바 */}
          <div
            ref={trackFillRef}
            className="absolute top-0 left-0 h-full bg-yellow-400"
          />

          {/* 달리는 사람 아이콘 */}
          <div
            ref={thumbRef}
            className="absolute top-1/2 -translate-y-1/2 text-base leading-none"
            aria-hidden="true"
          >
            🏃
          </div>

          {/* 코인 아이콘 (트랙 맨 끝) */}
          <div
            className="absolute top-1/2 right-0 translate-x-1 -translate-y-1/2 text-base leading-none"
            aria-hidden="true"
          >
            <Coin className="h-7 w-7" />
          </div>
        </div>
      </div>
    </div>
  );
});
