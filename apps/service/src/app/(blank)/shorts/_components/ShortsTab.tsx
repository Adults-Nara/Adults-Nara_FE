'use client';

import BaseShortsTab from '@/components/shortForm/BaseShortsTab';
import { useFeedVideoInfinite } from '@/lib/tanstack/query/recommendation.query';
import { useBookmarkListInfinite } from '@/lib/tanstack/query/bookmark.query';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { BookmarkListResponse } from '@/models/bookmark.model';
import { ShortFormVideoData } from '@/types/video';
import {
  mapBookmarkToShortsData,
  mapRecommendationToShortsData,
} from '@/utils/videoMapper';

export interface ShortsTabProps {
  params: { index?: number; listType?: string };
}

export default function ShortsTab({ params }: ShortsTabProps) {
  const FETCH_SIZE = 10;
  const WINDOW_SIZE = 30;
  // 북마크 기반인 경우
  const isBookmark = params.listType === 'bookmarkList';

  let videos: ShortFormVideoData[] = [];
  const feedQuery = useFeedVideoInfinite(FETCH_SIZE, !isBookmark);
  const bookmarkQuery = useBookmarkListInfinite(
    'SHORT',
    FETCH_SIZE,
    WINDOW_SIZE,
    params.index || 0,
    isBookmark,
  );

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    isBookmark ? bookmarkQuery : feedQuery;

  const rawVideos = isBookmark
    ? bookmarkQuery.data?.pages.flatMap((p) => p.items ?? []) || []
    : feedQuery.data?.pages.flatMap((p) => p.content ?? []) || [];

  videos = isBookmark
    ? (rawVideos as BookmarkListResponse[]).map(mapBookmarkToShortsData)
    : (rawVideos as RecommendationVideoItem[]).map(
        mapRecommendationToShortsData,
      );

  return (
    <>
      {isLoading && <div>로딩중...</div>}
      <BaseShortsTab
        algorithmList={videos}
        onRequireMoreVertical={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        initialIndex={params.index ? Number(params.index) % FETCH_SIZE : 0}
      />
    </>
  );
}
