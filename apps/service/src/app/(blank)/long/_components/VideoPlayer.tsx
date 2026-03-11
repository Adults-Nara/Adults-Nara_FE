'use client';

import ReactPlayer from 'react-player';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VideoControllerOverlay } from './VideoOverlay';

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  progress?: number; // 초기 재생 위치(%)
  onEnded?: () => void; // 영상 재생 완료 콜백
}

export function VideoPlayer({
  src,
  progress = 0,
  thumbnail,
  onEnded,
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
  const isDragging = useRef(false); // ProgressBar 드래그 상태 관리

  // video 요소 ref 콜백 - 메타데이터 로드 및 timeupdate 이벤트 설정
  const handleRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;
    playerRef.current = node;

    // 메타데이터가 이미 로드된 경우
    if (node.readyState >= 1) {
      // 영상 길이 설정 및 초기 재생 위치 적용
      setDuration(node.duration);
      if (progress > 0) {
        node.currentTime = (progress / 100) * node.duration;
      }
      setIsReady(true);
    } else {
      // 메타데이터 로드 이벤트 리스너 설정
      node.addEventListener('loadedmetadata', () => {
        setDuration(node.duration);
        if (progress > 0) {
          node.currentTime = (progress / 100) * node.duration;
        }
        setIsReady(true);
      });
    }
  }, []);

  // 영상 currentTime 업데이트. 0.1초마다 체크하여 업데이트 (재생 중일 때만)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (isDragging.current) return;
      if (playerRef.current) {
        setCurrentTime(playerRef.current.currentTime);
      }
    }, 100);

    return () => clearInterval(interval); // 컴포넌트가 꺼지면 타이머도 확실히 꺼집니다.
  }, [isPlaying]);

  // isPlaying 상태를 ref로도 관리하여 타이머 콜백에서 최신 상태 참조 가능하도록 함
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 영상 재생시, 컨트롤러 자동 숨김 타이머 초기화
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current ?? undefined);
    hideTimer.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 2000);
  }, []);

  // 컨트롤러 타이머 정지
  const stopHideTimer = useCallback(() => {
    clearTimeout(hideTimer.current ?? undefined);
  }, []);
  // 영상 재생 상태 변경 및 타이머 초기화
  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopHideTimer();
    } else {
      resetHideTimer();
    }
    setIsPlaying((isPlaying) => !isPlaying);
  }, [resetHideTimer, stopHideTimer]);

  // 컴포넌트 언마운트 시, 타이머 정리
  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current ?? undefined);
    };
  }, []);

  // 영상 재생 위치 업데이트
  const handleSeek = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen mode:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Failed to exit fullscreen mode:', err);
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={isPlaying ? resetHideTimer : undefined}
      onTouchStart={isPlaying ? resetHideTimer : undefined}
      role="region"
      aria-label="비디오 플레이어"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          togglePlay();
        }
      }}
    >
      {/* 영상 재생 */}
      <ReactPlayer
        ref={handleRefCallback}
        src={src}
        playing={isPlaying}
        playbackRate={playbackRate}
        controls={false}
        width="100%"
        height="100%"
        className="pointer-events-none h-full w-full"
        onEnded={() => {
          togglePlay();
          setShowControls(true);
          onEnded?.(); // 부모 컴포넌트(Manager 등)로 재생 완료 알림
        }}
      />

      <VideoControllerOverlay
        show={isReady && showControls}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        isDragging={isDragging}
        onTogglePlay={togglePlay}
        onShowControls={resetHideTimer}
        onSeek={handleSeek}
        onPlaybackRateChange={setPlaybackRate}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
