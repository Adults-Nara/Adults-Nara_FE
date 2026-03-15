import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, editComment } from '@/services/comment.api';
import { CommentCreateRequest, CommentEditRequest } from '@/models/comment.model';

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      videoId,
      data,
    }: {
      videoId: string;
      data: CommentCreateRequest;
    }) => createComment(videoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.videoId],
      });
      queryClient.invalidateQueries({
        queryKey: ['myComment', variables.videoId],
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['myComment'] });
    },
  });
}

export function useEditComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: CommentEditRequest }) =>
      editComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['myComment'] });
    },
  });
}
