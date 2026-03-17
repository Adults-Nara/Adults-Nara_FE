import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useBookmarkListInfinite } from '@/lib/tanstack/query/bookmark.query';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { toast } from '@/lib/toast';

export interface NextVideoInfo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  uploader: string;
}

export function usePlaylistAutoPlay(
  currentVideoId?: string,
  onBeforeNavigate?: () => void,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listType = searchParams.get('listType');

  const { data: bookmarkData } = useBookmarkListInfinite('LONG', 10, 30, 0, {
    enabled: listType === 'bookmarkList' && !!currentVideoId,
  });

  const { data: relatedData } = useRelatedVideosInfinite(
    currentVideoId,
    10,
    'LONG',
  );

  // 캐시에서 다음 영상 정보 계산 (없으면 null → overlay 미표시)
  const nextVideo = useMemo<NextVideoInfo | null>(() => {
    if (listType === 'bookmarkList') {
      const allItems = bookmarkData?.pages.flatMap((p) => p.items) ?? [];
      const idx = allItems.findIndex(
        (item) => String(item.videoId) === currentVideoId,
      );
      if (idx !== -1 && idx + 1 < allItems.length) {
        const next = allItems[idx + 1];
        return {
          videoId: String(next.videoId),
          title: next.title,
          thumbnailUrl: next.thumbnailUrl,
          uploader: next.uploaderName,
        };
      }
      return null;
    } else {
      const first = relatedData?.pages[0]?.content?.[0];
      if (!first) return null;
      return {
        videoId: first.videoId,
        title: first.title,
        thumbnailUrl: first.thumbnailSrc,
        uploader: first.uploader,
      };
    }
  }, [listType, bookmarkData, relatedData, currentVideoId]);

  const navigateToNext = useCallback(() => {
    if (!nextVideo) {
      toast.info('마지막 영상입니다.');
      return;
    }
    onBeforeNavigate?.();
    const url =
      listType === 'bookmarkList'
        ? `/long?v=${nextVideo.videoId}&listType=bookmarkList`
        : `/long?v=${nextVideo.videoId}`;
    router.push(url, { scroll: false });
  }, [nextVideo, listType, router, onBeforeNavigate]);

  return { nextVideo, navigateToNext };
}
