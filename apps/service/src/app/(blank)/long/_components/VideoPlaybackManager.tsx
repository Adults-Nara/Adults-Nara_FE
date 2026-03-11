'use client';

import { useSearchParams } from 'next/navigation';
import { useVideoS3Url } from '@/lib/tanstack/query/video.query';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VideoPlayer } from './VideoPlayer';
import { usePlaylistAutoPlay } from '@/hooks/usePlaylistAutoPlay';

interface VideoPlaybackManagerProps {
  thumbnail?: string;
}

export function VideoPlaybackManager({ thumbnail }: VideoPlaybackManagerProps) {
  const searchParams = useSearchParams();

  // URL에서 v 파라미터(shallow routing)를 가져옵니다.
  const videoId = searchParams.get('v') as string;

  // S3 원본 주소 API 호출 (캐싱된 프리패치 데이터가 있다면 즉시 반환)
  const {
    data: s3Data,
    isPending: isS3Pending,
    isError: isS3Error,
  } = useVideoS3Url(videoId);

  const s3Url = s3Data?.masterUrl;

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
    <VideoPlayer src={s3Url} thumbnail={thumbnail} onEnded={handleVideoEnd} />
  );
}
