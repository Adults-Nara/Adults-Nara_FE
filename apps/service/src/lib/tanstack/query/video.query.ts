import { useQuery } from '@tanstack/react-query';
import { getVideoS3Url } from '@/services/video.api';

export function useVideoS3Url(videoId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['s3-url', videoId],
    queryFn: () => getVideoS3Url(videoId),
    staleTime: (query) => {
      const expiresAt = query.state.data?.expiresAtEpochSeconds;
      if (!expiresAt) return 0;
      return expiresAt * 1000 - Date.now(); // 만료 전까지 캐시 유지
    },
  });

  return {
    data,
    isLoading,
    isError,
  };
}
