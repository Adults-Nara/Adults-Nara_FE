import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getRecommendationFeed,
  getRecommendationRelated,
} from '@/services/recommendation.api';

export function useRelatedVideosInfinite(videoId: string, size: number = 3) {
  return useInfiniteQuery({
    queryKey: ['recommendation-related', videoId],
    queryFn: ({ pageParam = 0 }) =>
      getRecommendationRelated(videoId, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If the API returns fewer items than requested, there's no more data
      if (!lastPage || lastPage.content.length < size) {
        return undefined;
      }
      return allPages.length; // Next page index
    },
    enabled: !!videoId,
  });
}

export function useFeedVideoInfinite(size: number = 3) {
  return useInfiniteQuery({
    queryKey: ['recommendation-feed'],
    queryFn: ({ pageParam = 0 }) => getRecommendationFeed(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.content.length < size) {
        return undefined;
      }
      return allPages.length;
    },
  });
}
