import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark, warmUpBookmarks } from '@/services/bookmark.api';

import { BookmarkStatusResponseDto } from '@/models/bookmark.model';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: string) => toggleBookmark(videoId),
    onMutate: async (videoId: string) => {
      // 1. 발송 예정인 쿼리 취소하여 낙관적 업데이트 덮어쓰기 방지
      await queryClient.cancelQueries({
        queryKey: ['bookmarkStatus', videoId],
      });

      // 2. 이전 상태 스냅샷 저장 (데이터 롤백용)
      const previousStatus =
        queryClient.getQueryData<BookmarkStatusResponseDto>([
          'bookmarkStatus',
          videoId,
        ]);

      // 3. 낙관적 캐시 업데이트
      queryClient.setQueryData(
        ['bookmarkStatus', videoId],
        (old: BookmarkStatusResponseDto | undefined) => {
          if (!old) return { isBookmarked: true }; // 캐시가 없었다면 추가 시도일 확률이 높음
          return { ...old, isBookmarked: !old.isBookmarked };
        },
      );

      // 에러 시 롤백에 사용할 컨텍스트 반환
      return {
        previousStatus,
        hadPreviousStatus: previousStatus !== undefined,
        videoId,
      };
    },
    onError: (_err, _videoId, context) => {
      if (!context) return;

      // 캐시가 없었던 경우: 생성된 optimistic 데이터 제거
      if (!context.hadPreviousStatus) {
        queryClient.removeQueries({
          queryKey: ['bookmarkStatus', context.videoId],
          exact: true,
        });
        return;
      }

      // 캐시가 있었던 경우: 이전 상태로 복구
      queryClient.setQueryData(
        ['bookmarkStatus', context.videoId],
        context.previousStatus,
      );
    },
    onSettled: (_, __, videoId) => {
      // 5. 성공이든 실패든 무조건 서버 최신 상태로 한 번 더 동기화
      queryClient.invalidateQueries({ queryKey: ['bookmarkStatus', videoId] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkSummary'] });
    },
  });
}

export function useWarmUpBookmarks() {
  return useMutation({
    mutationFn: () => warmUpBookmarks(),
  });
}
