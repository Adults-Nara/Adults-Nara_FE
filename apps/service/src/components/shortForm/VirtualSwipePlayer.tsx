'use client';
import ReactPlayer from 'react-player';
import { useRef, useState, ReactNode, useEffect } from 'react';
import { ShortFormVideoData } from '@/types/video';
import { useIsLoggedIn } from '@/store/useAuthStore';
export interface VirtualSwipePlayerProps {
  currentVideo: ShortFormVideoData;
  upVideo: ShortFormVideoData | null;
  downVideo: ShortFormVideoData | null;
  leftVideo: ShortFormVideoData | null;
  rightVideo: ShortFormVideoData | null;

  // Data extraction
  videoUrl: string | undefined; // final playable url
  videoLoading: boolean; // is url or data loading
  getThumbnailUrl: (video: ShortFormVideoData) => string;
  // Progress & events
  watchProgress?: number; // start position
  onStartWatching?: (videoId: number) => void; // Called when video begins playing
  onWatchProgressUpdate?: (currentTime: number) => void; // every 10s callback
  onStopWatching?: (videoId: number, watchTime: number) => void;

  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
  renderController?: (video: ShortFormVideoData) => ReactNode;
}

export function VirtualSwipePlayer(props: VirtualSwipePlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isLogin = useIsLoggedIn();
  // 로딩 상태나 URL이 바뀌면 플레이 상태 초기화
  useEffect(() => {
    setIsPlaying(true);
  }, [props.currentVideo, props.videoUrl, props.videoLoading]);

  // 최신 onStopWatching 콜백 참조 유지
  const latestStopWatchingRef = useRef(props.onStopWatching);
  useEffect(() => {
    latestStopWatchingRef.current = props.onStopWatching;
  }, [props.onStopWatching]);

  // 영상을 벗어날 때 (currentVideo 변경 또는 언마운트)
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시점에 playerRef.current가 유효한지 안전하게 검사
      if (latestStopWatchingRef.current && playerRef.current) {
        let currentTime = playerRef.current.currentTime || 0;
        latestStopWatchingRef.current(
          Number(props.currentVideo.videoId),
          Math.floor(currentTime),
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentVideo.videoId]);

  // 10초마다 시청 위치 업데이트 (onWatchProgressUpdate 프롭이 제공됐을 때만 실행)
  useEffect(() => {
    if (
      !isPlaying ||
      props.videoLoading ||
      !props.onWatchProgressUpdate ||
      !isLogin
    )
      return;

    const interval = setInterval(() => {
      // ReactPlayer 인스턴스를 통해 시청 위치 가져오기
      if (playerRef.current) {
        const currentTime = playerRef.current.currentTime;
        if (currentTime !== undefined) {
          props.onWatchProgressUpdate?.(Math.floor(currentTime));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    props.videoLoading,
    props.currentVideo,
    props.onWatchProgressUpdate,
  ]);

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
      if ((dx > 0 && !props.leftVideo) || (dx < 0 && !props.rightVideo)) return;
      setOffset({ x: dx, y: 0 });
    } else {
      if ((dy > 0 && !props.upVideo) || (dy < 0 && !props.downVideo)) return;
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
      // 짧은 터치 로직
      setIsPlaying((prev) => !prev);
      return;
    }

    const thresholdX = window.innerWidth * 0.25;
    const thresholdY = window.innerHeight * 0.25;

    let swipedDirection: 'up' | 'down' | 'left' | 'right' | null = null;

    // 손가락을 뗀 경우
    setIsAnimating(true);

    if (dragAxis.current === 'x') {
      if (offset.x < -thresholdX && props.rightVideo) {
        setOffset({ x: -window.innerWidth, y: 0 });
        swipedDirection = 'right'; // 손가락은 왼쪽으로 밀었지만, 우측 영상이 나오는 것
      } else if (offset.x > thresholdX && props.leftVideo) {
        setOffset({ x: window.innerWidth, y: 0 });
        swipedDirection = 'left';
      } else {
        setOffset({ x: 0, y: 0 }); // 제자리 복귀
      }
    } else if (dragAxis.current === 'y') {
      if (offset.y < -thresholdY && props.downVideo) {
        setOffset({ x: 0, y: -window.innerHeight });
        swipedDirection = 'down';
      } else if (offset.y > thresholdY && props.upVideo) {
        setOffset({ x: 0, y: window.innerHeight });
        swipedDirection = 'up';
      } else {
        setOffset({ x: 0, y: 0 });
      }
    }

    if (swipedDirection) {
      props.onSwipe(swipedDirection);
    }
    setIsAnimating(false);
    setOffset({ x: 0, y: 0 });
  };

  if (!props.videoUrl && !props.videoLoading) return <>에러: 비디오 URL 없음</>;
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
          {props.videoUrl && (
            <ReactPlayer
              key={`player-${props.currentVideo.videoId}`}
              onReady={() => {
                // URL이 준비되면 시청 위치로 이동
                if (playerRef.current && props.watchProgress) {
                  playerRef.current.currentTime = props.watchProgress;
                }
              }}
              ref={playerRef}
              src={props.videoUrl}
              playing={isPlaying}
              muted={false}
              controls={false}
              loop
              playsInline
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              onPlay={() => {
                setIsPlaying(true);
                if (!isLogin) return;
                if (
                  props.onStartWatching &&
                  playerRef.current?.currentTime === 0
                ) {
                  props.onStartWatching(Number(props.currentVideo.videoId));
                }
              }}
              onPause={() => setIsPlaying(false)}
            />
          )}

          {props.renderController && props.renderController(props.currentVideo)}
        </div>

        {/* 로딩 스피너 오버레이 (영상이 안 왔을 때) */}
        {props.videoLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
            <svg
              className="h-10 w-10 animate-spin text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {!isPlaying && !props.videoLoading && (
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
        {props.upVideo && (
          <img
            src={props.getThumbnailUrl(props.upVideo)}
            alt=""
            className="absolute inset-0 h-full w-full -translate-y-full object-cover"
          />
        )}
        {props.downVideo && (
          <img
            src={props.getThumbnailUrl(props.downVideo)}
            alt=""
            className="absolute inset-0 h-full w-full translate-y-full object-cover"
          />
        )}
        {props.leftVideo && (
          <img
            src={props.getThumbnailUrl(props.leftVideo)}
            alt=""
            className="absolute inset-0 h-full w-full -translate-x-full object-cover"
          />
        )}
        {props.rightVideo && (
          <img
            src={props.getThumbnailUrl(props.rightVideo)}
            alt=""
            className="absolute inset-0 h-full w-full translate-x-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
