import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getBookmarkList,
  getBookmarkStatus,
  getBookmarkSummary,
} from '@/services/bookmark.api';

export function useBookmarkListInfinite(
  videoType: 'SHORT' | 'LONG',
  size: number = 10,
  windowSize: number = 30,
  index: number = 0,
  enabled: boolean = true,
) {
  const maxPages = windowSize / size;
  const initailPage = Math.floor(index / size);
  return useInfiniteQuery({
    queryKey: ['bookmarks', videoType, size],
    queryFn: ({ pageParam = 0 }) => getBookmarkList(videoType, pageParam, size),
    initialPageParam: initailPage,
    // 뒤로 가는 경우, 앞 페이지 내용 제거
    getNextPageParam: (lastPage, _, lastPageParam) => {
      // 마지막 페이지라면 undefined 반환
      if (!lastPage || lastPage.items.length < size) {
        return undefined;
      }

      return lastPageParam + 1;
    },
    maxPages,
    enabled,
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
