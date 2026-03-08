import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getBookmarkList,
  getBookmarkStatus,
  getBookmarkSummary,
} from '@/services/bookmark.api';

export function useBookmarkList(videoType: 'SHORT' | 'LONG', size?: number) {
  return useInfiniteQuery({
    queryKey: ['bookmarks', videoType, size],
    queryFn: ({ pageParam = 0 }) => getBookmarkList(videoType, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
  });
}

export function useBookmarkStatus(videoId: number) {
  return useQuery({
    queryKey: ['bookmarkStatus', videoId],
    queryFn: () => getBookmarkStatus(videoId),
    enabled: !!videoId,
  });
}

export function useBookmarkSummary() {
  return useQuery({
    queryKey: ['bookmarkSummary'],
    queryFn: () => getBookmarkSummary(),
  });
}
