'use client';
import { useRef, useState, ReactNode, useEffect, useCallback } from 'react';
import { ShortFormVideoData } from '@/types/video';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { AdProgressBar } from '@/app/(blank)/long/_components/AdProgressBar';
import { toast } from '@/lib/toast';
import { useHlsPlayer } from '@/hooks/useHlsPlayer';
import { useQueryClient } from '@tanstack/react-query';

const SHORT_FORM_PLAYER_STYLE = `
  .shortform-player video {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
  }
`;

export interface VirtualSwipePlayerProps {
  currentVideo: ShortFormVideoData;
  upVideo: ShortFormVideoData | null;
  downVideo: ShortFormVideoData | null;
  leftVideo: ShortFormVideoData | null;
  rightVideo: ShortFormVideoData | null;

  // Data extraction
  videoUrl: string | undefined;
  videoLoading: boolean;
  videoError?: boolean;
  getThumbnailUrl: (video: ShortFormVideoData) => string;
  // Progress & events
  watchProgress?: number; // start position
  onStartWatching?: (videoId: string, watchSeconds: number) => void;
  onWatchProgressUpdate?: (currentTime: number, watchSeconds: number) => void;
  onStopWatching?: (
    videoId: string,
    lastTime: number,
    watchSeconds: number,
    errorMessage?: string,
  ) => void;

  hasNextPage?: boolean;

  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
  renderController?: (video: ShortFormVideoData) => ReactNode;
}

export function VirtualSwipePlayer(props: VirtualSwipePlayerProps) {
  /* --- 비디오 제어 및 시청 기록 로직 --- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTimeRef = useRef<number>(0);

  useHlsPlayer(videoRef, props.videoUrl ?? null);
  const isLogin = useIsLoggedIn();

  // play() Promise 추적 - pause() 호출 전 반드시 resolve 대기
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // 실제 재생 상태 (브라우저 이벤트 기준)
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

  // 사용자가 수동으로 일시정지했는지 여부 (canplay 시 자동재생 여부 결정)
  const isUserPausedRef = useRef(false);

  const latestStopWatchingRef = useRef(props.onStopWatching);
  const latestProgressUpdateRef = useRef(props.onWatchProgressUpdate);
  const lastReportedTimeRef = useRef<number>(Date.now());

  const queryClient = useQueryClient();
  const getStayingTimeDelta = useCallback(() => {
    const now = Date.now();
    const delta = Math.floor((now - lastReportedTimeRef.current) / 1000);
    lastReportedTimeRef.current = now;
    return delta;
  }, []);

  useEffect(() => {
    latestStopWatchingRef.current = props.onStopWatching;
  }, [props.onStopWatching]);

  useEffect(() => {
    latestProgressUpdateRef.current = props.onWatchProgressUpdate;
  }, [props.onWatchProgressUpdate]);

  useEffect(() => {
    if (!isLogin && props.currentVideo.isAd) {
      toast.info('로그인 후 광고 포인트를 받아가세요!');
    }
  }, [props.currentVideo.videoId, isLogin]);

  // 영상 변경 시 상태 초기화
  useEffect(() => {
    isUserPausedRef.current = false;
    setIsActuallyPlaying(false);
    playPromiseRef.current = null;
  }, [props.currentVideo.videoId]);

  // 벗어날 때 기록 저장
  useEffect(() => {
    return () => {
      if (latestStopWatchingRef.current && videoRef.current) {
        const finalTime =
          videoRef.current.currentTime ?? currentTimeRef.current;
        latestStopWatchingRef.current(
          props.currentVideo.videoId,
          Math.floor(finalTime),
          getStayingTimeDelta(),
        );
      }
    };
  }, [props.currentVideo.videoId]);

  // 10초마다 주기적 업데이트
  useEffect(() => {
    if (
      !isActuallyPlaying ||
      props.videoLoading ||
      !isLogin ||
      props.currentVideo.isAd
    )
      return;

    const interval = setInterval(() => {
      if (videoRef.current && latestProgressUpdateRef.current) {
        const currentTime = videoRef.current.currentTime || 0;
        currentTimeRef.current = currentTime;
        latestProgressUpdateRef.current(
          Math.floor(currentTime),
          getStayingTimeDelta(),
        );
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [
    isActuallyPlaying,
    props.videoLoading,
    props.currentVideo.videoId,
    isLogin,
  ]);

  // canplay: 영상 재생 준비 완료. 사용자가 일시정지하지 않은 경우 자동재생
  const handleCanPlay = useCallback(() => {
    if (isUserPausedRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    playPromiseRef.current = video.play();
    playPromiseRef.current?.catch(() => {
      // 브라우저 정책으로 차단된 경우 실제 상태를 false로
      setIsActuallyPlaying(false);
    });
  }, []);

  // 클릭 토글용 play/pause (play Promise 레이스 컨디션 방지)
  // isActuallyPlaying 대신 video.paused 기준으로 분기 — React 상태가 불일치해도 동작 보장
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      isUserPausedRef.current = true;
      if (playPromiseRef.current) {
        const pendingPlay = playPromiseRef.current;
        const srcAtPauseRequest = video.currentSrc;
        playPromiseRef.current = null;
        pendingPlay
          .then(() => {
            if (video.currentSrc === srcAtPauseRequest) video.pause();
          })
          .catch(() => {});
      } else {
        video.pause();
      }
    } else {
      isUserPausedRef.current = false;
      playPromiseRef.current = video.play();
      playPromiseRef.current?.catch(() => {
        setIsActuallyPlaying(false);
      });
    }
  }, []);

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
      const canSwipeDown = !!props.downVideo || !!props.hasNextPage;
      if ((dy > 0 && !props.upVideo) || (dy < 0 && !canSwipeDown)) return;
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
      togglePlayPause();
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
      if (dy < -thresholdY && (props.downVideo || props.hasNextPage))
        swipedDirection = 'down';
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
      onPointerLeave={() => {
        if (isDragging.current) {
          isDragging.current = false;
          setOffset({ x: 0, y: 0 });
        }
      }}
      // 드래그 시 이미지/텍스트 선택 방지
      onDragStart={(e) => e.preventDefault()}
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
        <div className="shortform-player absolute inset-0 h-full w-full">
          {props.videoUrl ? (
            <video
              ref={videoRef}
              poster={props.getThumbnailUrl(props.currentVideo) || undefined}
              playsInline
              muted={false}
              controls={false}
              onCanPlay={handleCanPlay}
              onPlay={() => {
                setIsActuallyPlaying(true);
                if (!isLogin) return;
                const currentTime = videoRef.current?.currentTime || 0;
                if (props.onStartWatching && currentTime < 1) {
                  props.onStartWatching(
                    props.currentVideo.videoId,
                    getStayingTimeDelta(),
                  );
                }
              }}
              onPause={() => setIsActuallyPlaying(false)}
              onTimeUpdate={() => {
                
                if (!isActuallyPlaying) setIsActuallyPlaying(true);
              }}
              onEnded={() => {
                setIsActuallyPlaying(false);
                if (isLogin) {
                  props.onStopWatching?.(
                    props.currentVideo.videoId,
                    Math.floor(props.currentVideo.duration),
                    getStayingTimeDelta(),
                  );
                  if (props.currentVideo.isAd) {
                    queryClient.invalidateQueries({
                      queryKey: ['pointBalance'],
                    });
                    toast.success('포인트가 적립되었습니다!');
                  }
                }
                // 처음으로 돌리기
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : props.videoError ? (
            <div className="flex h-dvh w-full flex-col items-center justify-center bg-black p-4 text-center text-white">
              <p className="title3 mb-4">영상을 불러오는 데 실패했습니다.</p>
            </div>
          ) : null}

          {props.renderController && props.renderController(props.currentVideo)}
          {props.currentVideo.isAd && (
            <div className="pointer-events-none absolute bottom-0 left-0 z-50 w-full p-1">
              <AdProgressBar
                playerRef={videoRef}
                duration={props.currentVideo.duration}
              />
            </div>
          )}
        </div>

        {!isActuallyPlaying && !props.videoLoading && (
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

        {props.currentVideo.isAd && (
          <div className="absolute bottom-4 left-1/2 h-1 w-3/4 -translate-x-1/2 transform bg-white/50"></div>
        )}
        {/* 상하좌우 썸네일 */}
        {props.upVideo?.thumbnail && (
          <img
            src={props.getThumbnailUrl(props.upVideo)}
            alt=""
            className="absolute inset-0 h-full w-full -translate-y-full object-cover"
          />
        )}
        {props.downVideo?.thumbnail && (
          <img
            src={props.getThumbnailUrl(props.downVideo)}
            alt=""
            className="absolute inset-0 h-full w-full translate-y-full object-cover"
          />
        )}
        {props.leftVideo?.thumbnail && (
          <img
            src={props.getThumbnailUrl(props.leftVideo)}
            alt=""
            className="absolute inset-0 h-full w-full -translate-x-full object-cover"
          />
        )}
        {props.rightVideo?.thumbnail && (
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
