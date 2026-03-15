import { useQuery, queryOptions } from '@tanstack/react-query';
import { getVideoS3Url, getVideoDetail } from '@/services/video.api';

export const videoS3UrlQueryOptions = (videoId?: string) =>
  queryOptions({
    queryKey: ['s3-url', videoId],
    queryFn: () => {
      if (!videoId) throw new Error('videoId is required');
      return getVideoS3Url(videoId);
    },
    staleTime: (query: any) => {
      const expiresAt = query.state.data?.expiresAtEpochSeconds;
      if (!expiresAt) return 0;
      return expiresAt * 1000 - Date.now(); // 만료 전까지 캐시 유지
    },
  });

export function useVideoS3Url(videoId?: string) {
  const parsedVideoId = Number(videoId);
  const hasValidVideoId = !isNaN(parsedVideoId) && parsedVideoId > 0;
  const { data, isPending, isError } = useQuery({
    ...videoS3UrlQueryOptions(videoId),
    enabled: hasValidVideoId,
  });

  return {
    data,
    isPending,
    isError,
  };
}

export function useVideoDetail(videoId?: string) {
  const parsedVideoId = Number(videoId);
  const hasValidVideoId = !isNaN(parsedVideoId) && parsedVideoId > 0;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['video-detail', videoId],
    queryFn: () => getVideoDetail(videoId as string),
    enabled: hasValidVideoId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
