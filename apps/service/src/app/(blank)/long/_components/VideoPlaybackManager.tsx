'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import {
  useVideoS3Url,
  useVideoDetail,
} from '@/lib/tanstack/query/video.query';
import {
  useUpdateWatchPosition,
  useStopWatching,
} from '@/lib/tanstack/mutation/watch-history.mutation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VideoPlayer } from './VideoPlayer';
import { usePlaylistAutoPlay } from '@/hooks/usePlaylistAutoPlay';
import { useAdManager } from '@/hooks/useAdManager';
import { useIsLoggedIn } from '@/store/useAuthStore';

export function VideoPlaybackManager() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');

  // 1. 시청 기록 및 비디오 메타데이터 가져오기
  const { data: detailData } = useVideoDetail(videoId || undefined);

  const watchHistory = detailData?.watchHistory;
  const isVideoCompleted = watchHistory
    ? watchHistory.lastPosition >= watchHistory.duration - 5
    : false;
  const progress = isVideoCompleted ? 0 : (watchHistory?.lastPosition ?? 0);

  // 2. 광고 상태 머신 (40% 확률 Pre-roll)
  const { adState, adVideoUrl, onAdEnded, onAdSkipped } = useAdManager(
    videoId ? videoId : null,
  );

  // 광고가 완전히 끝났거나 애초에 당첨되지 않아 스킵된 상태인지 확인
  const isAdFinishedOrSkipped = adState === 'COMPLETED_OR_SKIPPED';

  // 3. 메인 영상 S3 호출 (광고가 완전히 끝났을 때만 API 실행)
  const {
    data: s3Data,
    isPending: isS3Pending,
    isError: isS3Error,
  } = useVideoS3Url(isAdFinishedOrSkipped ? videoId || undefined : undefined);

  const rawS3Url = s3Data?.masterUrl;
  const s3Url =
    process.env.NODE_ENV === 'development'
      ? rawS3Url?.replace(process.env.NEXT_PUBLIC_STREAM_DOMAIN!, '/stream')
      : rawS3Url;

  // 4. 로그인 & 시청 기록 로직
  const isLoggedIn = useIsLoggedIn();
  // TODO : video Id 없는 경우 처리
  const { mutate: updatePosition } = useUpdateWatchPosition(videoId || '0');
  const { mutate: stopWatching } = useStopWatching();

  const lastReportedTimeRef = useRef(Date.now());

  useEffect(() => {
    lastReportedTimeRef.current = Date.now();
  }, [videoId]);

  const getStayingTimeDelta = useCallback(() => {
    const now = Date.now();
    const delta = Math.floor((now - lastReportedTimeRef.current) / 1000);
    lastReportedTimeRef.current = now;
    return delta;
  }, []);

  const handleWatchProgressUpdate = useCallback(
    (currentTime: number) => {
      if (isLoggedIn && currentTime > 0) {
        updatePosition({
          lastPosition: currentTime,
          watchSeconds: getStayingTimeDelta(),
        });
      }
    },
    [isLoggedIn, updatePosition],
  );

  const handleStopWatching = useCallback(
    (currentTime: number) => {
      if (isLoggedIn && currentTime > 0) {
        stopWatching({
          videoId: videoId || '-1',
          body: { lastPosition: currentTime, watchSeconds: currentTime },
        });
      }
    },
    [isLoggedIn, stopWatching, videoId],
  );

  // 재생 목록(찜 목록 등) 자동 재생 훅
  const handleVideoEnd = usePlaylistAutoPlay(videoId || undefined, () => {
    lastReportedTimeRef.current = Date.now();
  });

  // 광고 종료/스킵 시 lastReportedTimeRef 리셋 후 원래 핸들러 호출
  const handleAdEnded = useCallback(
    (duration: number) => {
      lastReportedTimeRef.current = Date.now();
      onAdEnded(duration);
    },
    [onAdEnded],
  );

  const handleAdSkipped = useCallback(() => {
    lastReportedTimeRef.current = Date.now();
    onAdSkipped();
  }, [onAdSkipped]);

  if (!videoId) {
    return (
      <div
        className="flex w-full items-center justify-center bg-black text-white"
        style={{ aspectRatio: '16/9' }}
      >
        유효하지 않은 영상입니다.
      </div>
    );
  }

  // 광고 상태가 준비 중이거나, 광고 재생 턴인데 URL이 아직 안 왔다면 로딩
  if (
    adState === 'IDLE' ||
    adState === 'FETCHING' ||
    (adState === 'PLAYING' && !adVideoUrl)
  ) {
    return (
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        <LoadingSpinner thumbnail={detailData?.thumbnailUrl ?? ''} />
      </div>
    );
  }

  const isAdPlaying = adState === 'PLAYING' && !!adVideoUrl;

  // 광고 턴이 끝났는데, 메인 영상 S3 주소가 아직 안 왔다면 로딩
  if (!isAdPlaying && (isS3Pending || !s3Url)) {
    return (
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        <LoadingSpinner thumbnail={detailData?.thumbnailUrl ?? ''} />
      </div>
    );
  }

  // 메인 영상 에러 처리
  if (!isAdPlaying && isS3Error) {
    return (
      <div
        className="flex w-full items-center justify-center bg-black text-white"
        style={{ aspectRatio: '16/9' }}
      >
        영상을 불러오지 못했습니다.
      </div>
    );
  }

  // 5. URL 확정 및 렌더링
  const currentUrl = isAdPlaying ? adVideoUrl : s3Url;

  return (
    <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
      <VideoPlayer
        key={videoId} // 안정적인 재조정을 위해 비디오 ID를 키로 사용
        src={currentUrl || null}
        progress={isAdPlaying ? 0 : progress}
        thumbnail={detailData?.thumbnailUrl ?? ''}
        isAdMode={isAdPlaying}
        onAdEnded={handleAdEnded} // 광고가 끝났을 때 메인 영상으로 넘어가도록
        onAdSkip={handleAdSkipped}
        onEnded={handleVideoEnd}
        onWatchProgressUpdate={handleWatchProgressUpdate}
        onStopWatching={handleStopWatching}
      />
    </div>
  );
}
