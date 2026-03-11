import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeVideo, dislikeVideo } from '@/services/interaction.api';

import {
  InteractionStatusResponse,
  InteractionType,
} from '@/models/interaction.model';

export function useLikeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: number) => likeVideo(videoId),
    onMutate: async (videoId: number) => {
      const queryKey = ['interaction', String(videoId)];
      await queryClient.cancelQueries({ queryKey });

      const previousStatus =
        queryClient.getQueryData<InteractionStatusResponse>(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: InteractionStatusResponse | undefined) => {
          const currentType = old?.interactionType;
          const newType: InteractionType =
            currentType === 'LIKE' ? null : 'LIKE';
          return { interactionType: newType };
        },
      );

      return { previousStatus, queryKey };
    },
    onError: (err, videoId, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(context.queryKey, context.previousStatus);
      }
    },
    onSettled: (_, __, videoId) => {
      queryClient.invalidateQueries({
        queryKey: ['interaction', String(videoId)],
      });
    },
  });
}

export function useDislikeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: number) => dislikeVideo(videoId),
    onMutate: async (videoId: number) => {
      const queryKey = ['interaction', String(videoId)];
      await queryClient.cancelQueries({ queryKey });

      const previousStatus =
        queryClient.getQueryData<InteractionStatusResponse>(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: InteractionStatusResponse | undefined) => {
          const currentType = old?.interactionType;
          const newType: InteractionType =
            currentType === 'DISLIKE' ? null : 'DISLIKE';
          return { interactionType: newType };
        },
      );

      return { previousStatus, queryKey };
    },
    onError: (err, videoId, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(context.queryKey, context.previousStatus);
      }
    },
    onSettled: (_, __, videoId) => {
      queryClient.invalidateQueries({
        queryKey: ['interaction', String(videoId)],
      });
    },
  });
}
