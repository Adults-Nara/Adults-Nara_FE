import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getWatchHistory,
  getRecentWatchHistory,
} from '@/services/watch-history.api';
import { useIsLoggedIn } from '@/store/useAuthStore';

export function useWatchHistory(videoId: number) {
  const isLogin = useIsLoggedIn();
  return useQuery({
    queryKey: ['watchHistory', videoId],
    queryFn: () => getWatchHistory(videoId),
    enabled: isLogin && !!videoId,
  });
}

export function useRecentWatchHistory(size?: number) {
  const isLogin = useIsLoggedIn();
  return useInfiniteQuery({
    queryKey: ['recentWatchHistory', size],
    queryFn: ({ pageParam = 0 }) => getRecentWatchHistory(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
    enabled: isLogin,
  });
}
