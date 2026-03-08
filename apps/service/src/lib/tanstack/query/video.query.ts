import { useQuery } from '@tanstack/react-query';
import {
  getRecommendationFeed,
  getRecommendationRelated,
  getVideoS3Url,
} from '@/services/video.api';

export function useRelatedVideos(videoId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommendation-related', videoId],
    queryFn: () => getRecommendationRelated(videoId),
  });

  return {
    videos: data?.content ?? [],
    isLoading,
    isError,
  };
}

export function useFeedVideo() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommendation-feed'],
    queryFn: () => getRecommendationFeed(),
  });

  return {
    videos: data?.content ?? [],
    isLoading,
    isError,
  };
}

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
