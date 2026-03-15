'use client';
import ReactPlayer from 'react-player';
import { useRef, useState, ReactNode, useEffect } from 'react';
import { ShortFormVideoData } from '@/types/video';
import { useIsLoggedIn } from '@/store/useAuthStore';

/**
 * 숏폼 플레이어 전용 스타일
 * 라이브러리 내부의 CSS 변수 및 Shadow DOM 요소를 강제로 제어하여
 * 16:9 영상을 세로 꽉 차게(cover) 만듭니다.
 */
const SHORT_FORM_PLAYER_STYLE = `
  .shortform-player {
    --media-object-fit: cover !important;
  }
  .shortform-player :where(video, [part="video"], media-video, canvas) {
    object-fit: cover !important;
    max-width: none !important;
  }
`;

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
  onStartWatching?: (videoId: string) => void; // Called when video begins playing
  onWatchProgressUpdate?: (currentTime: number) => void; // every 10s callback
  onStopWatching?: (videoId: string, watchTime: number) => void;

  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
  renderController?: (video: ShortFormVideoData) => ReactNode;
}

export function VirtualSwipePlayer(props: VirtualSwipePlayerProps) {
  /* --- 비디오 제어 및 시청 기록 로직 --- */
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const currentTimeRef = useRef<number>(0);
  const isLogin = useIsLoggedIn();
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const isPlaying = playingVideoId === props.currentVideo.videoId;
  const initializedVideoIdRef = useRef<string | null>(null);
  const latestStopWatchingRef = useRef(props.onStopWatching);
  useEffect(() => {
    latestStopWatchingRef.current = props.onStopWatching;
  }, [props.onStopWatching]);

  // 벗어날 때 기록 저장
  useEffect(() => {
    return () => {
      if (latestStopWatchingRef.current) {
        latestStopWatchingRef.current(
          props.currentVideo.videoId,
          Math.floor(currentTimeRef.current),
        );
      }
    };
  }, [props.currentVideo.videoId]);

  // 자동 재생 타이머
  useEffect(() => {
    const starterTimer = setTimeout(
      () => setPlayingVideoId(props.currentVideo.videoId),
      100,
    );
    return () => clearTimeout(starterTimer);
  }, [props.currentVideo.videoId]);

  // 10초마다 주기적 업데이트
  useEffect(() => {
    if (
      !isPlaying ||
      props.videoLoading ||
      !props.onWatchProgressUpdate ||
      !isLogin
    )
      return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.currentTime;
        currentTimeRef.current = currentTime;
        props.onWatchProgressUpdate?.(Math.floor(currentTime));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [
    isPlaying,
    props.videoLoading,
    props.currentVideo.videoId,
    props.onWatchProgressUpdate,
    isLogin,
  ]);

  /* 통합 포인터(터치/마우스) 스와이프 로직 */
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const dragStart = useRef({ x: 0, y: 0, time: 0 });
  const dragAxis = useRef<'x' | 'y' | null>(null);
  const isDragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    // @ts-ignore - 브라우저 기본 터치 액션 방해 금지 (CSS touch-action: none 권장)
    if (e.pointerType === 'touch') e.target.releasePointerCapture(e.pointerId);

    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    dragAxis.current = null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isAnimating) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (!dragAxis.current) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return; // 미세 진동 무시
      dragAxis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (dragAxis.current === 'x') {
      if ((dx > 0 && !props.leftVideo) || (dx < 0 && !props.rightVideo)) return;
      setOffset({ x: dx, y: 0 });
    } else {
      if ((dy > 0 && !props.upVideo) || (dy < 0 && !props.downVideo)) return;
      setOffset({ x: 0, y: dy });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || isAnimating) return;
    isDragging.current = false;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeElapsed = Date.now() - dragStart.current.time;

    // 1. 단순 클릭/터치 판정
    if (distance < 10 && timeElapsed < 300) {
      setPlayingVideoId((prev) =>
        prev === props.currentVideo.videoId ? null : props.currentVideo.videoId,
      );
      setOffset({ x: 0, y: 0 });
      return;
    }

    // 2. 스와이프 판정
    const thresholdX = window.innerWidth * 0.25;
    const thresholdY = window.innerHeight * 0.25;
    let swipedDirection: 'up' | 'down' | 'left' | 'right' | null = null;

    setIsAnimating(true);

    if (dragAxis.current === 'x') {
      if (dx < -thresholdX && props.rightVideo) swipedDirection = 'right';
      else if (dx > thresholdX && props.leftVideo) swipedDirection = 'left';
    } else if (dragAxis.current === 'y') {
      if (dy < -thresholdY && props.downVideo) swipedDirection = 'down';
      else if (dy > thresholdY && props.upVideo) swipedDirection = 'up';
    }

    if (swipedDirection) {
      props.onSwipe(swipedDirection);
    }

    // 애니메이션 후 초기화
    setTimeout(() => {
      setOffset({ x: 0, y: 0 });
      setIsAnimating(false);
    }, 200); // CSS transition 시간과 맞춤
  };

  return (
    <div
      className="relative h-dvh w-full touch-none overflow-hidden bg-black select-none"
      // 포인터 이벤트로 통합
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      // 컨테이너 밖으로 나갔을 때의 안전장치
      onPointerLeave={(e) => {
        if (isDragging.current) {
          isDragging.current = false;
          setOffset({ x: 0, y: 0 });
        }
      }}
      // 드래그 시 이미지/텍스트 선택 방지
      onDragStart={(e) => e.preventDefault()}
      // 인라인 스타일로 오프셋 적용
    >
      <style>{SHORT_FORM_PLAYER_STYLE}</style>
      <div
        className="relative h-full w-full"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {/* 중앙 플레이어 */}
        <div className="absolute inset-0 h-full w-full">
          {props.videoUrl && (
            <ReactPlayer
              key={`player-${props.currentVideo.videoId}`}
              className="shortform-player"
              onReady={() => {
                if (
                  initializedVideoIdRef.current !== props.currentVideo.videoId
                ) {
                  initializedVideoIdRef.current = props.currentVideo.videoId; // 현재 영상 ID 기억
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
                if (!isLogin) return;
                if (
                  props.onStartWatching &&
                  playerRef.current?.currentTime === 0
                ) {
                  props.onStartWatching(props.currentVideo.videoId);
                }
              }}
              onTimeUpdate={() => {
                // currentTimeRef를 항상 최신 시청 위치로 유지 (unmount cleanup에서 사용)
                if (playerRef.current) {
                  currentTimeRef.current = playerRef.current.currentTime;
                }
              }}
              onPause={() => {
                if (playingVideoId === props.currentVideo.videoId) {
                  setPlayingVideoId(null);
                }
              }}
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
              viewBox="0 0 24 24"
              fill="rgba(255, 255, 255, 0.8)"
              height="72"
              className="drop-shadow-lg"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        )}

        {/* TODO : 광고일 경우, AD 프로그래스바 */}
        {props.currentVideo.isAd && (
          <div className="absolute bottom-4 left-1/2 h-1 w-3/4 -translate-x-1/2 transform bg-white/50"></div>
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
