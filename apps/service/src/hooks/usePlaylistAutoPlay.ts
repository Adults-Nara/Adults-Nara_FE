import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useBookmarkListInfinite } from '@/lib/tanstack/query/bookmark.query';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { toast } from '@/lib/toast';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';

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
  const nextVideo = useMemo<ThumbnailData | null>(() => {
    if (listType === 'bookmarkList') {
      const allItems = bookmarkData?.pages.flatMap((p) => p.items) ?? [];
      const idx = allItems.findIndex(
        (item) => String(item.videoId) === currentVideoId,
      );
      if (idx !== -1 && idx + 1 < allItems.length) {
        const next = allItems[idx + 1];
        return {
          id: String(next.videoId),
          thumbnailSrc: next.thumbnailUrl,
          title: next.title,
          uploader: next.uploaderName,
          duration: formatVideoTime(next.duration),
          progress: next.watchProgressPercent,
          views: next.viewCount,
          date: next.uploadDate,
          type: 'long',
        };
      }
      return null;
    } else {
      const first = relatedData?.pages[0]?.content?.[0];
      if (!first) return null;
      return {
        id: first.videoId,
        thumbnailSrc: first.thumbnailSrc,
        title: first.title,
        uploader: first.uploader,
        duration: formatVideoTime(first.duration),
        progress: first.progress,
        views: first.views,
        date: first.date,
        type: first.videoType === 'LONG' ? 'long' : 'short',
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
        ? `/long?v=${nextVideo.id}&listType=bookmarkList`
        : `/long?v=${nextVideo.id}`;
    router.push(url, { scroll: false });
  }, [nextVideo, listType, router, onBeforeNavigate]);

  return { nextVideo, navigateToNext };
}
