import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useBookmarkListInfinite } from '@/lib/tanstack/query/bookmark.query';

export function usePlaylistAutoPlay(currentVideoId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const listType = searchParams.get('listType');

  // listType이 bookmarkList일 때만 찜 목록 데이터를 fetching 해와서 캐시 유지
  const {
    data: bookmarkData,
    hasNextPage,
    fetchNextPage,
  } = useBookmarkListInfinite('LONG', 10, 30, 0);

  const handleVideoEnd = useCallback(() => {
    if (listType === 'bookmarkList') {
      // 훅이 성공적으로 가져온 데이터 활용
      if (bookmarkData && bookmarkData.pages) {
        // 모든 페이지의 항목들을 1차원 배열로 펼치기
        const allItems = bookmarkData.pages.flatMap((page) => page.items);

        // 현재 영상의 인덱스 찾기
        const currentIndex = allItems.findIndex(
          (item) => String(item.videoId) === currentVideoId,
        );

        // 다음 영상이 로드된 데이터 안에 존재한다면
        if (currentIndex !== -1 && currentIndex + 1 < allItems.length) {
          const nextVideoId = allItems[currentIndex + 1].videoId;
          // Shallow Routing, 다음 영상으로 넘어가기
          router.push(`/long?v=${nextVideoId}&listType=bookmarkList`, {
            scroll: false,
          });
          return;
        } else if (hasNextPage) {
          fetchNextPage().then((res) => {
            if (res.data && res.data.pages) {
              const newAllItems = res.data.pages.flatMap((page) => page.items);
              const newIndex = newAllItems.findIndex(
                (item) => String(item.videoId) === currentVideoId,
              );
              if (newIndex !== -1 && newIndex + 1 < newAllItems.length) {
                const nextVideoId = newAllItems[newIndex + 1].videoId;
                router.push(`/long?v=${nextVideoId}&listType=bookmarkList`, {
                  scroll: false,
                });
                return;
              }
            }
          });
          return;
        } else {
          // 마지막 영상인 경우 안내
          alert('찜 목록의 마지막 영상입니다.');
        }
      }
    }
  }, [
    currentVideoId,
    listType,
    bookmarkData,
    hasNextPage,
    fetchNextPage,
    router,
  ]);

  return handleVideoEnd;
}
