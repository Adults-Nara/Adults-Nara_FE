'use client';

import { useSearchParams } from 'next/navigation';
import {
  useVideoS3Url,
  useVideoDetail,
} from '@/lib/tanstack/query/video.query';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VideoPlayer } from './VideoPlayer';
import { usePlaylistAutoPlay } from '@/hooks/usePlaylistAutoPlay';
import { useIsLoggedIn } from '@/store/useAuthStore';
import {
  useUpdateWatchPosition,
  useStopWatching,
} from '@/lib/tanstack/mutation/watch-history.mutation';
import { useCallback } from 'react';

interface VideoPlaybackManagerProps {
  thumbnail?: string;
}

export function VideoPlaybackManager({ thumbnail }: VideoPlaybackManagerProps) {
  const searchParams = useSearchParams();

  // URL에서 v 파라미터(shallow routing) 가져오기.
  const videoId = searchParams.get('v') as string;

  // 시청 기록 및 비디오 메타데이터를 가져오기.
  const { data: detailData } = useVideoDetail(Number(videoId));

  // 영상 끝까지 다 본 경우 (종료 5초 전 포함) 0초부터 시작
  const watchHistory = detailData?.watchHistory;
  const isVideoCompleted = watchHistory
    ? watchHistory.lastPosition >= watchHistory.duration - 5
    : false;
  const progress = isVideoCompleted ? 0 : (watchHistory?.lastPosition ?? 0);

  // S3 원본 주소 API 호출 (캐싱된 프리패치 데이터가 있다면 즉시 반환)
  const {
    data: s3Data,
    isPending: isS3Pending,
    isError: isS3Error,
  } = useVideoS3Url(videoId);

  const s3Url = s3Data?.masterUrl;

  // 로그인 & 시청 기록 로직
  const isLoggedIn = useIsLoggedIn();
  const { mutate: updatePosition } = useUpdateWatchPosition(Number(videoId));
  const { mutate: stopWatching } = useStopWatching();

  const handleWatchProgressUpdate = useCallback(
    (currentTime: number) => {
      if (isLoggedIn && currentTime > 0) {
        updatePosition({ lastPosition: currentTime });
      }
    },
    [isLoggedIn, updatePosition],
  );

  const handleStopWatching = useCallback(
    (currentTime: number) => {
      if (isLoggedIn && currentTime > 0) {
        stopWatching({
          videoId: Number(videoId),
          body: { lastPosition: currentTime },
        });
      }
    },
    [isLoggedIn, stopWatching, videoId],
  );

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

  // 재생 목록(찜 목록 등) 자동 재생 훅
  const handleVideoEnd = usePlaylistAutoPlay(videoId);

  // TODO: 추후 이곳에 광고 API 호출(useAdVideoUrl) 및 showAd 상태 관리 로직이 추가될 예정입니다.

  if (isS3Error) {
    return (
      <div
        className="flex w-full items-center justify-center bg-black text-white"
        style={{ aspectRatio: '16/9' }}
      >
        영상을 불러오지 못했습니다.
      </div>
    );
  }

  if (isS3Pending || !s3Url) {
    return (
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        <LoadingSpinner thumbnail={thumbnail ?? ''} />
      </div>
    );
  }

  // 본 영상 재생 (순수 VideoPlayer 컴포넌트 재사용)
  return (
    <VideoPlayer
      src={s3Url}
      progress={progress}
      thumbnail={thumbnail}
      onEnded={handleVideoEnd}
      onWatchProgressUpdate={handleWatchProgressUpdate}
      onStopWatching={handleStopWatching}
    />
  );
}
