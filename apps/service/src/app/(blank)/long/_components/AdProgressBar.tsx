'use client';

import { formatVideoTime } from '@/utils/format';
import { Coin } from '@repo/ui';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdProgressBarProps {
  currentTime?: number; // 숏폼 등에서 직접 넘겨줄 때
  duration?: number; // 전체 길이
  playerRef?: React.RefObject<HTMLVideoElement | any>; // 롱폼 등 Ref로 접근할 때
}

export const AdProgressBar = React.memo(function AdProgressBar({
  currentTime: propsCurrentTime,
  duration: propsDuration,
  playerRef,
}: AdProgressBarProps) {
  // 내부 상태 관리 (Ref 사용 시 실시간 업데이트용)
  const [internalTime, setInternalTime] = useState(0);
  const [internalDuration, setInternalDuration] = useState(0);

  // 1. 어떤 소스(Props vs Ref)를 사용할지 결정
  const currentTime = propsCurrentTime ?? internalTime;
  const duration = propsDuration ?? internalDuration;
  const percent = duration > 0 ? currentTime / duration : 0;
  const [hasEarned, setHasEarned] = useState(false);

  // 2. PlayerRef가 있을 경우 실시간 Polling
  useEffect(() => {
    if (!playerRef?.current) return;

    const player = playerRef.current;

    const updateProgress = () => {
      setInternalTime(player.currentTime || 0);
      if (player.duration) setInternalDuration(player.duration);
    };

    // 비디오 이벤트에 리스너 등록
    player.addEventListener('timeupdate', updateProgress);
    player.addEventListener('loadedmetadata', updateProgress);

    return () => {
      player.removeEventListener('timeupdate', updateProgress);
      player.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [playerRef]);

  useEffect(() => {
    if (percent >= 1 && !hasEarned) {
      setHasEarned(true);
    }
  }, [percent, hasEarned]);

  return (
    <div className="flex flex-col justify-start" aria-label="광고 재생 진행률">
      <div className="body3 flex items-center justify-between px-4 pt-1">
        <div className="w-fit text-white">
          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
        </div>
      </div>

      <div className="pointer-events-none w-full flex-1 px-3 py-3 select-none">
        <div className="relative h-2.5 rounded-full bg-white/30">
          {/* 진행 채움 바 (Ref 대신 style 객체로 연동하여 선언적 관리) */}
          <div
            className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-100 ease-linear"
            style={{ width: `${percent * 100}%` }}
          />

          {/* 달리는 사람 아이콘 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 text-base leading-none transition-all duration-100 ease-linear"
            style={{ left: `calc(${percent * 100}% - 10px)` }}
            aria-hidden="true"
          >
            🏃
          </div>

          {/* 코인 아이콘: 100%가 되면 사라짐 */}
          <AnimatePresence>
            {!hasEarned && (
              <motion.div
                key="reward-coin"
                initial={{ opacity: 1, y: '-50%', scale: 1 }}
                // 사라질 때의 연출
                exit={{
                  y: '-200%', // 더 높이 튀어오름
                  opacity: 0,
                  scale: 1.8,
                  filter: 'brightness(2) blur(1px)', // 화려하게 터지는 느낌
                  transition: { duration: 0.6, ease: 'easeOut' },
                }}
                className="absolute top-1/2 right-0 translate-x-1 text-base leading-none"
                aria-hidden="true"
              >
                <Coin className="h-7 w-7" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
