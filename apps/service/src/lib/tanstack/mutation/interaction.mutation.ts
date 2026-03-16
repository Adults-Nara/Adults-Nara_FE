import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  likeVideo,
  dislikeVideo,
  superLikeVideo,
} from '@/services/interaction.api';

import { InteractionStatusResponse } from '@/models/interaction.model';
import { InteractionType } from '@/types/interaction';

export function useLikeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: string) => likeVideo(videoId),
    onMutate: async (videoId: string) => {
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
      // previousStatus가 undefined여도 명시적으로 복구
      queryClient.setQueryData(
        context?.queryKey ?? [],
        context?.previousStatus,
      );
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
    mutationFn: (videoId: string) => dislikeVideo(videoId),
    onMutate: async (videoId: string) => {
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

export function useSuperLikeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: string) => superLikeVideo(videoId),
    onMutate: async (videoId: string) => {
      const queryKey = ['interaction', String(videoId)];
      await queryClient.cancelQueries({ queryKey });

      const previousStatus =
        queryClient.getQueryData<InteractionStatusResponse>(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: InteractionStatusResponse | undefined) => {
          const currentType = old?.interactionType;
          const newType: InteractionType =
            currentType === 'SUPERLIKE' ? null : 'DISLIKE';
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
