import { useQuery } from '@tanstack/react-query';
import {
  searchVideos,
  autocomplete,
  SearchVideosParams,
} from '@/services/search.api';
import { getBookmarkRanking } from '@/services/ranking.api';

export function useSearchVideos(params: SearchVideosParams) {
  return useQuery({
    queryKey: ['search', 'videos', params],
    queryFn: () => searchVideos(params),
  });
}

export function useAutocomplete(keyword: string) {
  return useQuery({
    queryKey: ['search', 'autocomplete', keyword],
    queryFn: () => autocomplete(keyword),
    enabled: !!keyword && keyword.trim().length > 0,
  });
}

export function useRanking(limit: number = 10) {
  return useQuery({
    queryKey: ['ranking', limit],
    queryFn: () => getBookmarkRanking(limit),
  });
}
