import { useIsLoggedIn } from './../../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import {
  getParentTagsWithChild,
  getMyChildTags,
  getVideosByTag,
  getTagWatchStats,
  getUserPreferences,
  getMyPreferences,
} from '@/services/tag.api';

export const TAG_KEYS = {
  parentWithChild: ['tags', 'parent-with-child'] as const,
  myChildTags: ['tags', 'my-child-tags'] as const,
  videosByTag: (tagId: number) => ['tags', 'videos', tagId] as const,
  watchStats: ['tags', 'watch-stats'] as const,
  userPreferences: (userId: number) => ['prefs', 'user', userId] as const,
  myPreferences: ['prefs', 'my'] as const,
};

// 부모 태그 + 자식 태그 목록 조회
export function useParentTagsWithChild() {
  const { data, isLoading, isError } = useQuery({
    queryKey: TAG_KEYS.parentWithChild,
    queryFn: getParentTagsWithChild,
  });

  return {
    tags: data ?? [],
    isLoading,
    isError,
  };
}

// 내 관심 태그(자식) 목록 조회
export function useMyChildTags() {
  const IsLoggin = useIsLoggedIn();
  const { data, isPending, isError } = useQuery({
    queryKey: TAG_KEYS.myChildTags,
    queryFn: getMyChildTags,
    enabled: IsLoggin,
  });

  if (!IsLoggin)
    return {
      tags: [],
      isPending: false,
      isError: false,
    };

  return {
    tags: data ?? [],
    isPending,
    isError,
  };
}

// 태그별 영상 목록 조회
export function useVideosByTag(tagId: number, options?: { enabled?: boolean }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: TAG_KEYS.videosByTag(tagId),
    queryFn: () => getVideosByTag(tagId),
    enabled: (options?.enabled ?? true) && !!tagId,
  });

  return {
    videos: data ?? [],
    isPending,
    isError,
    refetch,
  };
}

// 태그별 시청 통계 조회
export function useTagWatchStats() {
  const { data, isPending, isError } = useQuery({
    queryKey: TAG_KEYS.watchStats,
    queryFn: getTagWatchStats,
  });

  return {
    stats: data ?? [],
    isPending,
    isError,
  };
}

// 특정 유저 선호 태그 조회 (관리자)
export function useUserPreferences(userId: number, limit: number = 10) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [...TAG_KEYS.userPreferences(userId), limit],
    queryFn: () => getUserPreferences(userId, limit),
    enabled: !!userId,
  });

  return {
    preferences: data ?? [],
    isLoading,
    isError,
  };
}

// 내 선호 태그 조회
export function useMyPreferences(limit: number = 10) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [...TAG_KEYS.myPreferences, limit],
    queryFn: () => getMyPreferences(limit),
  });

  return {
    preferences: data ?? [],
    isLoading,
    isError,
  };
}
