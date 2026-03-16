import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getComments, getMyComment } from '@/services/comment.api';

export function useComments(videoId: string, size: number = 20) {
  return useInfiniteQuery({
    queryKey: ['comments', videoId, size],

    queryFn: ({ pageParam = 0 }) => getComments(videoId, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      return pages.length;
    },
    enabled: !!videoId,
  });
}

export function useMyComment(videoId: string) {
  return useQuery({
    queryKey: ['myComment', videoId],
    queryFn: () => getMyComment(videoId),
  });
}
