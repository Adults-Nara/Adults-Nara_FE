'use client';

import Hls, { type Level } from 'hls.js';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface HlsLevel {
  index: number;
  height: number; // 480, 720, 1080 등
  bitrate: number;
}

interface UseHlsPlayerReturn {
  levels: HlsLevel[];
  currentLevel: number; // -1 = Auto
  setLevel: (index: number) => void;
}

const isHlsUrl = (src: string) => src.includes('.m3u8');

export function useHlsPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string | null,
): UseHlsPlayerReturn {
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<HlsLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // 이전 hls 인스턴스 정리
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setLevels([]);
    setCurrentLevel(-1);

    if (!isHlsUrl(src)) {
      // HLS가 아닌 경우 (광고 등 MP4) — 네이티브 재생
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ startLevel: -1 }); // Auto 시작
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const parsedLevels: HlsLevel[] = data.levels.map(
          (l: Level, i: number) => ({
            index: i,
            height: l.height,
            bitrate: l.bitrate,
          }),
        );
        setLevels(parsedLevels);
        setCurrentLevel(-1);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        // Auto 모드일 때는 -1 유지
        if (hls.autoLevelEnabled) {
          setCurrentLevel(-1);
        } else {
          setCurrentLevel(data.level);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari
      video.src = src;
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [src, videoRef]);

  const setLevel = useCallback((index: number) => {
    const hls = hlsRef.current;
    if (!hls) return;

    if (index === -1) {
      hls.currentLevel = -1; // Auto
      hls.nextLevel = -1;
      setCurrentLevel(-1);
    } else {
      hls.currentLevel = index;
      setCurrentLevel(index);
    }
  }, []);

  return { levels, currentLevel, setLevel };
}
