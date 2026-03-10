import { useQuery } from '@tanstack/react-query';
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

export function useRecentWatchHistory(page = 0, size = 10) {
  const isLogin = useIsLoggedIn();
  return useQuery({
    queryKey: ['recentWatchHistory', page, size],
    queryFn: () => getRecentWatchHistory(page, size),
    enabled: isLogin,
  });
}
