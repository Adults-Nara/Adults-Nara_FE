import { useQuery, queryOptions } from '@tanstack/react-query';
import { getVideoS3Url, getVideoDetail } from '@/services/video.api';

export const videoS3UrlQueryOptions = (videoId: string) =>
  queryOptions({
    queryKey: ['s3-url', videoId],
    queryFn: () => getVideoS3Url(videoId),
    staleTime: (query: any) => {
      const expiresAt = query.state.data?.expiresAtEpochSeconds;
      if (!expiresAt) return 0;
      return expiresAt * 1000 - Date.now(); // 만료 전까지 캐시 유지
    },
  });

export function useVideoS3Url(videoId: string) {
  const { data, isPending, isError } = useQuery({
    ...videoS3UrlQueryOptions(videoId),
    enabled: !!videoId,
  });

  return {
    data,
    isPending,
    isError,
  };
}

export function useVideoDetail(videoId: number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['video-detail', videoId],
    queryFn: () => getVideoDetail(videoId!),
    enabled: !!videoId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
