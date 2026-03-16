import { useInfiniteQuery, infiniteQueryOptions } from '@tanstack/react-query';
import {
  getRecommendationFeedVertical,
  getRecommendationHomeFeed,
  getRecommendationRelated,
} from '@/services/recommendation.api';

export function useRelatedVideosInfinite(
  videoId?: string,
  size: number = 10,
  videoType: 'SHORT' | 'LONG' = 'SHORT',
) {
  return useInfiniteQuery({
    queryKey: ['recommendation-related', videoId, videoType, size],
    queryFn: ({ pageParam = 0 }) =>
      getRecommendationRelated(videoId!, pageParam, size, videoType),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNext) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
    enabled: !!videoId,
  });
}

export const feedVideoQueryOptions = (
  size: number = 10,
  videoType: 'SHORT' | 'LONG' = 'SHORT',
) =>
  infiniteQueryOptions({
    queryKey: ['recommendation-feed', size, videoType],
    queryFn: ({ pageParam = 0 }) =>
      getRecommendationFeedVertical(pageParam, size, videoType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.hasNext) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
  });

export function useFeedVideoInfinite(
  size: number = 10,
  enabled: boolean = true,
  videoType: 'SHORT' | 'LONG' = 'SHORT',
) {
  return useInfiniteQuery({
    ...feedVideoQueryOptions(size, videoType),
    enabled,
  });
}

export function useHomeFeedVideoInfinite(size?: number) {
  return useInfiniteQuery({
    queryKey: ['recommendation-homefeed', size],
    queryFn: ({ pageParam = 0 }) => getRecommendationHomeFeed(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNext) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
  });
}
