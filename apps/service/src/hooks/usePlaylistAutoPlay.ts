import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useBookmarkListInfinite } from '@/lib/tanstack/query/bookmark.query';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { BookmarkPageResponse } from '@/models/bookmark.model';
import { InfiniteData } from '@tanstack/react-query';

// 영상을 찾을 때 까지 페이지를 순차적으로 호출하는 함수
// 없으면 null 반환, 있으면 다음 영상 ID 반환. 다음 영상 ID는 query에 저장되어있으므로 빠르게 접근 가능.
async function fetchUntilFound(
  fetchNextPage: () => Promise<{ data?: InfiniteData<BookmarkPageResponse> }>,
  hasNextPage: boolean,
  currentVideoId?: string,
): Promise<string | null> {
  if (!hasNextPage || !currentVideoId) return null;

  const result = await fetchNextPage();
  const pages = result.data?.pages;
  if (!pages) return null;

  const allItems = pages.flatMap((page) => page.items);
  const currentIndex = allItems.findIndex(
    (item) => String(item.videoId) === currentVideoId,
  );

  if (currentIndex !== -1 && currentIndex + 1 < allItems.length) {
    return String(allItems[currentIndex + 1].videoId);
  }

  // 아직 못 찾았고, 다음 페이지 파라미터를 확인하기 위해 마지막 페이지를 체크
  const lastPage = pages[pages.length - 1];
  const nextHasMore = lastPage && lastPage.items.length >= 10;

  if (nextHasMore) {
    return fetchUntilFound(fetchNextPage, true, currentVideoId);
  }

  return null;
}

export function usePlaylistAutoPlay(currentVideoId?: string, onBeforeNavigate?: () => void) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const listType = searchParams.get('listType');

  // listType이 bookmarkList일 때만 찜 목록 데이터를 fetching 해와서 캐시 유지
  const {
    data: bookmarkData,
    hasNextPage,
    fetchNextPage,
  } = useBookmarkListInfinite('LONG', 10, 30, 0, {
    enabled: listType === 'bookmarkList' && !!currentVideoId,
  });

  // 일반 영상일 때 관련 추천 영상을 가져옴
  const { data: relatedData } = useRelatedVideosInfinite(
    currentVideoId,
    10,
    'LONG',
  );

  const handleVideoEnd = useCallback(async () => {
    if (listType === 'bookmarkList') {
      if (bookmarkData?.pages) {
        const allItems = bookmarkData.pages.flatMap((page) => page.items);
        const currentIndex = allItems.findIndex(
          (item) => String(item.videoId) === currentVideoId,
        );

        if (currentIndex !== -1 && currentIndex + 1 < allItems.length) {
          const nextVideoId = allItems[currentIndex + 1].videoId;
          onBeforeNavigate?.();
          router.push(`/long?v=${nextVideoId}&listType=bookmarkList`, {
            scroll: false,
          });
          return;
        }

        // 현재 영상을 아직 캐시에서 못 찾은 경우, 페이지를 순차 로드하며 탐색
        const nextVideoId = await fetchUntilFound(
          fetchNextPage as () => Promise<{
            data?: InfiniteData<BookmarkPageResponse>;
          }>,
          hasNextPage ?? false,
          currentVideoId,
        );

        if (nextVideoId) {
          onBeforeNavigate?.();
          router.push(`/long?v=${nextVideoId}&listType=bookmarkList`, {
            scroll: false,
          });
        } else {
          alert('찜 목록의 마지막 영상입니다.');
        }
      }
    } else {
      // 일반 영상인 경우 추천 영상 첫 번째로 넘어가기
      if (relatedData?.pages && relatedData.pages.length > 0) {
        const firstRelatedVideo = relatedData.pages[0].content?.[0];
        if (firstRelatedVideo) {
          onBeforeNavigate?.();
          router.push(`/long?v=${firstRelatedVideo.videoId}`, {
            scroll: false,
          });
        }
      }
    }
  }, [
    currentVideoId,
    listType,
    bookmarkData,
    hasNextPage,
    fetchNextPage,
    relatedData,
    router,
    onBeforeNavigate,
  ]);

  return handleVideoEnd;
}
