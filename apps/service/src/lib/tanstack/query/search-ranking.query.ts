import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  searchVideos,
  autocomplete,
  SearchVideosParams,
} from '@/services/search.api';
import { getBookmarkRanking } from '@/services/ranking.api';

export function useSearchVideos(params: SearchVideosParams) {
  return useInfiniteQuery({
    queryKey: [
      'search',
      'videos',
      params.keyword,
      params.videoType,
      params.tag,
      params.size,
    ],

    queryFn: ({ pageParam = 0 }) =>
      searchVideos({
        ...params,
        page: pageParam,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
}

export function useAutocomplete(keyword: string) {
  return useQuery({
    queryKey: ['search', 'autocomplete', keyword],
    queryFn: () => autocomplete(keyword),
    enabled: !!keyword && keyword.trim().length > 0,
    placeholderData: (prev) => prev,
  });
}

export function useRanking(limit: number = 10) {
  return useQuery({
    queryKey: ['ranking', limit],
    queryFn: () => getBookmarkRanking(limit),
  });
}
