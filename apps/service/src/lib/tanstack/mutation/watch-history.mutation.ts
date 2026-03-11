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

export function useStopWatching() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      videoId,
      body,
    }: {
      videoId: number;
      body: WatchPositionRequest;
    }) => stopWatching(videoId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['watchHistory', variables.videoId],
      });
      queryClient.invalidateQueries({ queryKey: ['recentWatchHistory'] });
    },
  });
}
