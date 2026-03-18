'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { VideoControllerOverlay } from './VideoOverlay';
import { PageHeader } from './PageHeader';
import { toast } from '@/lib/toast';
import { useHlsPlayer } from '@/hooks/useHlsPlayer';

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
  onSeek?: () => void;
  endOverlay?: ReactNode;
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
  onSeek,
  endOverlay,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [isReady, setIsReady] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  const isDragging = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { levels, currentLevel, setLevel } = useHlsPlayer(playerRef, src);

  // src가 바뀔 때마다 상태 초기화
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsReady(false);
    setIsPlaying(false);
    setShowControls(true);
    clearTimeout(hideTimer.current ?? undefined);
  }, [src]);

  // loadedmetadata: duration 설정 및 progress 시작 지점 이동
  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (progress > 0) {
        video.currentTime = progress;
      }
      setIsReady(true);
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () =>
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [src, progress]);

  // 실제 재생 상태 동기화 (autoplay 성공/실패, 외부 개입 등 모두 반영)
  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  // currentTime 폴링
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

  // 시청 기록 업데이트 (광고 제외)
  useEffect(() => {
    if (!isPlaying || isAdMode) return;
    const watchHistoryInterval = setInterval(() => {
      if (playerRef.current && onWatchProgressUpdate) {
        onWatchProgressUpdate(playerRef.current.currentTime);
      }
    }, 10000);
    return () => clearInterval(watchHistoryInterval);
  }, [isPlaying, isAdMode, onWatchProgressUpdate]);

  // playbackRate 동기화
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 언마운트 시 시청 기록 저장 (광고 제외)
  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current ?? undefined);
      if (!isAdMode && playerRef.current) {
        onStopWatching?.(playerRef.current.currentTime);
      }
    };
  }, [isAdMode, onStopWatching]);

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
    const video = playerRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      stopHideTimer();
      if (!isAdMode) onStopWatching?.(video.currentTime);
    } else {
      video.play().catch(() => {});
      resetHideTimer();
    }
  }, [resetHideTimer, stopHideTimer, isAdMode, onStopWatching]);

  const handleSeek = useCallback(
    (time: number) => {
      if (playerRef.current) {
        playerRef.current.currentTime = time;
        setCurrentTime(time);
        onSeek?.();
      }
    },
    [onSeek],
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement !== container) {
      container.requestFullscreen().catch(() => {
        toast.error('이 브라우저는 전체화면 모드를 지원하지 않습니다.');
      });
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  const handleEnded = useCallback(() => {
    stopHideTimer();
    if (isAdMode) {
      onAdEnded?.(duration);
    } else {
      setIsPlaying(false);
      setShowControls(true);
      if (playerRef.current) {
        onStopWatching?.(playerRef.current.currentTime);
      }
      onEnded?.();
    }
  }, [isAdMode, duration, onAdEnded, onStopWatching, onEnded, stopHideTimer]);

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
      <video
        ref={playerRef}
        playsInline
        className="pointer-events-none h-full w-full"
        onEnded={handleEnded}
        autoPlay
      />

      <VideoControllerOverlay
        show={isReady && showControls}
        isAdMode={isAdMode}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        isDragging={isDragging}
        videoRef={playerRef}
        endOverlay={endOverlay}
        levels={levels}
        currentLevel={currentLevel}
        onTogglePlay={togglePlay}
        onShowControls={resetHideTimer}
        onSeek={handleSeek}
        onPlaybackRateChange={setPlaybackRate}
        onToggleFullscreen={toggleFullscreen}
        onLevelChange={setLevel}
        onSkip={onAdSkip}
      />
      {!isFullscreen && <PageHeader />}
    </div>
  );
}
