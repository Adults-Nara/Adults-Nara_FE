'use client';

import ReactPlayer from 'react-player';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VideoControllerOverlay } from './VideoOverlay';

interface VideoPlayerProps {
  src: string | null;
  thumbnail?: string;
  progress?: number;
  onEnded?: () => void;
  onWatchProgressUpdate?: (currentTime: number) => void;
  onStopWatching?: (currentTime: number) => void;
  isAdMode?: boolean;
  onAdEnded?: (duration: number) => void;
  onAdSkip?: () => void;
}

export function VideoPlayer({
  src,
  thumbnail,
  progress = 0,
  onEnded,
  onWatchProgressUpdate,
  onStopWatching,
  isAdMode = false,
  onAdEnded,
  onAdSkip,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [isReady, setIsReady] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  const isDragging = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // src(url)가 바뀔 때마다 상태 초기화
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsReady(false);
    setIsPlaying(true);
  }, [src]);

  // 원본의 훌륭한 DOM 직접 제어 로직 유지
  const handleRefCallback = useCallback(
    (node: HTMLVideoElement | null) => {
      if (!node) return;
      playerRef.current = node;

      if (node.readyState >= 1) {
        setDuration(node.duration);
        if (progress > 0) {
          node.currentTime = progress;
        }
        setIsReady(true);
      } else {
        const handleLoadedMetadata = () => {
          setDuration(node.duration);
          if (progress > 0) {
            node.currentTime = progress;
          }
          setIsReady(true);
        };
        node.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () =>
          node.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    },
    [progress],
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (isDragging.current) return;
      if (playerRef.current) {
        setCurrentTime(playerRef.current.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 광고 모드일 때는 시청 기록 업데이트 타이머를 돌리지 않음
  useEffect(() => {
    if (!isPlaying || isAdMode) return;

    const watchHistoryInterval = setInterval(() => {
      if (playerRef.current && onWatchProgressUpdate) {
        onWatchProgressUpdate(playerRef.current.currentTime);
      }
    }, 10000);

    return () => clearInterval(watchHistoryInterval);
  }, [isPlaying, isAdMode, onWatchProgressUpdate]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current ?? undefined);
    hideTimer.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 2000);
  }, []);

  const stopHideTimer = useCallback(() => {
    clearTimeout(hideTimer.current ?? undefined);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopHideTimer();
      // 💡 광고 모드가 아닐 때만 시청 기록 저장
      if (!isAdMode && playerRef.current) {
        onStopWatching?.(playerRef.current.currentTime);
      }
    } else {
      resetHideTimer();
    }
    setIsPlaying((prev) => !prev);
  }, [resetHideTimer, stopHideTimer, isAdMode, onStopWatching]);

  // 언마운트 시 시청 기록 저장 (광고 제외)
  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current ?? undefined);
      // 언마운트 시점에 playerRef가 남아있는지 확인
      if (!isAdMode && playerRef.current) {
        onStopWatching?.(playerRef.current.currentTime);
      }
    };
  }, [isAdMode, onStopWatching]);

  const handleSeek = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  }, []);
  if (!src) {
    return (
      <div
        className="relative flex w-full items-center justify-center bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="thumbnail"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        ) : null}
        {/* 원하신다면 여기에 LoadingSpinner를 넣으셔도 좋습니다 */}
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={!isAdMode && isPlaying ? resetHideTimer : undefined}
      onTouchStart={!isAdMode && isPlaying ? resetHideTimer : undefined}
      role="region"
      aria-label="비디오 플레이어"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          if (!isAdMode) togglePlay();
        }
      }}
    >
      <ReactPlayer
        ref={handleRefCallback}
        src={src}
        playing={isPlaying}
        playbackRate={playbackRate}
        controls={false}
        onReady={() => {
          // 광고 모드가 아니면, progress가 0보다 클 때에만 시점을 이동
          if (playerRef.current && progress > 0) {
            playerRef.current.currentTime = progress;
          }
        }}
        width="100%"
        height="100%"
        className="pointer-events-none h-full w-full"
        onEnded={() => {
          stopHideTimer();

          if (isAdMode) {
            // 광고 영상 종료
            onAdEnded?.(duration);
          } else {
            // 일반 메인 영상 종료
            togglePlay();
            setIsPlaying(false);
            setShowControls(true);
            if (playerRef.current) {
              onStopWatching?.(playerRef.current.currentTime);
            }
            onEnded?.();
          }
        }}
      />

      {/* VideoControllerOverlay에 광고 모드 속성 전달 */}
      <VideoControllerOverlay
        show={isReady && showControls}
        isAdMode={isAdMode}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        isDragging={isDragging}
        isFullscreen={isFullscreen}
        onTogglePlay={togglePlay}
        onShowControls={resetHideTimer}
        onSeek={handleSeek}
        onPlaybackRateChange={setPlaybackRate}
        onToggleFullscreen={toggleFullscreen}
        onSkip={onAdSkip}
      />
    </div>
  );
}
