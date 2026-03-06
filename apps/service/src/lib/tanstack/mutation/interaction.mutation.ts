import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeVideo, dislikeVideo } from '@/services/interaction.api';

export function useLikeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: number) => likeVideo(videoId),
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: ['interaction', String(videoId)] });
    },
  });
}

export function useDislikeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: number) => dislikeVideo(videoId),
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: ['interaction', String(videoId)] });
    },
  });
}
