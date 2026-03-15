import { useQuery } from '@tanstack/react-query';
import { getComments, getMyComment } from '@/services/comment.api';
import {
  CommentCreateRequest,
  CommentEditRequest,
} from '@/models/comment.model';

export function useComments(
  videoId: string,
  page: number = 0,
  size: number = 20,
) {
  return useQuery({
    queryKey: ['comments', videoId, page, size],
    queryFn: () => getComments(videoId, page, size),
  });
}

export function useMyComment(videoId: string) {
  return useQuery({
    queryKey: ['myComment', videoId],
    queryFn: () => getMyComment(videoId),
  });
}
