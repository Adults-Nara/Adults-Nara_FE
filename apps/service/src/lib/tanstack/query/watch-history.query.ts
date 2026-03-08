import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getWatchHistory,
  getRecentWatchHistory,
} from '@/services/watch-history.api';

export function useWatchHistory(videoId: number) {
  return useQuery({
    queryKey: ['watchHistory', videoId],
    queryFn: () => getWatchHistory(videoId),
  });
}

export function useRecentWatchHistory(size?: number) {
  return useInfiniteQuery({
    queryKey: ['recentWatchHistory', size],
    queryFn: ({ pageParam = 0 }) => getRecentWatchHistory(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
  });
}
