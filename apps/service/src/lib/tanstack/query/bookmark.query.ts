import { useQuery } from '@tanstack/react-query';
import {
  getBookmarkList,
  getBookmarkStatus,
  getBookmarkSummary,
} from '@/services/bookmark.api';

export function useBookmarkList(
  videoType: 'SHORT' | 'LONG',
  page: number = 0,
  size: number = 10,
) {
  return useQuery({
    queryKey: ['bookmarks', videoType, page, size],
    queryFn: () => getBookmarkList(videoType, page, size),
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
