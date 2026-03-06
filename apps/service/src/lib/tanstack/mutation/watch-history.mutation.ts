import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateWatchPosition,
  stopWatching,
} from '@/services/watch-history.api';
import { WatchPositionRequest } from '@/models/watch-history.model';

export function useUpdateWatchPosition(videoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: WatchPositionRequest) =>
      updateWatchPosition(videoId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchHistory', videoId] });
      queryClient.invalidateQueries({ queryKey: ['recentWatchHistory'] });
    },
  });
}

export function useStopWatching(videoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: WatchPositionRequest) => stopWatching(videoId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchHistory', videoId] });
      queryClient.invalidateQueries({ queryKey: ['recentWatchHistory'] });
    },
  });
}
