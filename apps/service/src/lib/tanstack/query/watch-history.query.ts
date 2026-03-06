import { useQuery } from '@tanstack/react-query';
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

export function useRecentWatchHistory(page = 0, size = 10) {
  return useQuery({
    queryKey: ['recentWatchHistory', page, size],
    queryFn: () => getRecentWatchHistory(page, size),
  });
}
