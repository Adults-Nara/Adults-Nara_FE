'use client';
import ReactPlayer from 'react-player';
import { useRef, useState, ReactNode, useEffect } from 'react';

export interface VirtualSwipePlayerProps<T> {
  currentVideo: T;
  upVideo: T | null;
  downVideo: T | null;
  leftVideo: T | null;
  rightVideo: T | null;

  // Data extraction
  videoUrl: string | undefined; // final playable url
  videoLoading: boolean; // is url or data loading
  getThumbnailUrl: (video: T) => string;

  // Progress & events
  watchProgress?: number; // start position
  onWatchProgressUpdate?: (currentTime: number) => void; // every 10s callback

  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
  renderController?: (video: T) => ReactNode;
}

export function VirtualSwipePlayer<T>({
  currentVideo,
  upVideo,
  downVideo,
  leftVideo,
  rightVideo,
  videoUrl,
  videoLoading,
  getThumbnailUrl,
  watchProgress = 0,
  onWatchProgressUpdate,
  onSwipe,
  renderController,
}: VirtualSwipePlayerProps<T>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // 로딩 상태나 URL이 바뀌면 플레이 상태 초기화
  useEffect(() => {
    setIsPlaying(true);
  }, [currentVideo, videoUrl, videoLoading]);

  // 10초마다 시청 위치 업데이트 (onWatchProgressUpdate 프롭이 제공됐을 때만 실행)
  useEffect(() => {
    if (!isPlaying || videoLoading || !onWatchProgressUpdate) return;

    const interval = setInterval(() => {
      // ReactPlayer 대신 HTMLVideoElement를 직접 참조 중이므로 currentTime 바로 접근
      const currentTime = videoRef.current?.currentTime;
      if (currentTime !== undefined) {
        onWatchProgressUpdate(Math.floor(currentTime));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, videoLoading, currentVideo, onWatchProgressUpdate]);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const dragAxis = useRef<'x' | 'y' | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    dragAxis.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAnimating) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    if (!dragAxis.current) {
      if (Math.abs(dx) > Math.abs(dy)) dragAxis.current = 'x';
      else dragAxis.current = 'y';
    }

    if (dragAxis.current === 'x') {
      if ((dx > 0 && !leftVideo) || (dx < 0 && !rightVideo)) return;
      setOffset({ x: dx, y: 0 });
    } else {
      if ((dy > 0 && !upVideo) || (dy < 0 && !downVideo)) return;
      setOffset({ x: 0, y: dy });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating) return;

    // 터치, 스와이프 구분
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStart.current.x;
    const dy = endY - touchStart.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeElapsed = Date.now() - touchStart.current.time;

    if (distance < 10 && timeElapsed < 400) {
      // 짧은 터치: 재생/일시정지 토글
      if (videoRef.current) {
        setIsPlaying((prev) => !prev);
      }
      return;
    }

    const thresholdX = window.innerWidth * 0.25;
    const thresholdY = window.innerHeight * 0.25;

    let swipedDirection: 'up' | 'down' | 'left' | 'right' | null = null;

    // 손가락을 뗀 경우
    setIsAnimating(true);

    if (dragAxis.current === 'x') {
      if (offset.x < -thresholdX && rightVideo) {
        setOffset({ x: -window.innerWidth, y: 0 });
        swipedDirection = 'right'; // 손가락은 왼쪽으로 밀었지만, 우측 영상이 나오는 것
      } else if (offset.x > thresholdX && leftVideo) {
        setOffset({ x: window.innerWidth, y: 0 });
        swipedDirection = 'left';
      } else {
        setOffset({ x: 0, y: 0 }); // 제자리 복귀
      }
    } else if (dragAxis.current === 'y') {
      if (offset.y < -thresholdY && downVideo) {
        setOffset({ x: 0, y: -window.innerHeight });
        swipedDirection = 'down';
      } else if (offset.y > thresholdY && upVideo) {
        setOffset({ x: 0, y: window.innerHeight });
        swipedDirection = 'up';
      } else {
        setOffset({ x: 0, y: 0 });
      }
    }

    if (swipedDirection) {
      onSwipe(swipedDirection);
    }
    setIsAnimating(false);
    setOffset({ x: 0, y: 0 });
  };

  if (videoLoading || !videoUrl) return <>로딩중..</>;
  return (
    <div
      className="relative h-dvh w-full touch-none overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {/* [중앙] 플레이어 */}
        <div className="absolute inset-0 h-full w-full">
          <ReactPlayer
            ref={videoRef}
            src={videoUrl}
            playing={isPlaying}
            controls={false}
            config={{
              hls: {
                startPosition: watchProgress,
                xhrSetup: (xhr: XMLHttpRequest) => {
                  xhr.withCredentials = true; // 쿠키 포함
                },
              },
            }}
            loop
            playsInline
            width="100%"
            height="100%"
            style={{ objectFit: 'cover' }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {renderController && renderController(currentVideo)}
        </div>
        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="rgba(255, 255, 255, 0.8)"
              className="drop-shadow-lg"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        )}
        {/* 상하좌우 썸네일 */}
        {upVideo && (
          <img
            src={getThumbnailUrl(upVideo)}
            alt=""
            className="absolute inset-0 h-full w-full -translate-y-full object-cover"
          />
        )}
        {downVideo && (
          <img
            src={getThumbnailUrl(downVideo)}
            alt=""
            className="absolute inset-0 h-full w-full translate-y-full object-cover"
          />
        )}
        {leftVideo && (
          <img
            src={getThumbnailUrl(leftVideo)}
            alt=""
            className="absolute inset-0 h-full w-full -translate-x-full object-cover"
          />
        )}
        {rightVideo && (
          <img
            src={getThumbnailUrl(rightVideo)}
            alt=""
            className="absolute inset-0 h-full w-full translate-x-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
