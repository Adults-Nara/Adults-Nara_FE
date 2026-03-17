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
  const hasValidVideoId = !!videoId;
  const { data, isPending, isError, refetch } = useQuery({
    ...videoS3UrlQueryOptions(videoId),
    enabled: hasValidVideoId,
    retry: 1,
  });

  return {
    data,
    isPending,
    isError,
    refetch,
  };
}

export function useVideoDetail(videoId?: string) {
  const hasValidVideoId = !!videoId;
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
