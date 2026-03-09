'use client';

import BaseShortsTab from '@/components/shortForm/BaseShortsTab';
import { useFeedVideoInfinite } from '@/lib/tanstack/query/recommendation.query';

export default function ShortsTab() {
  const FETCH_SIZE = 10;
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFeedLoading,
  } = useFeedVideoInfinite(FETCH_SIZE);

  const videos = feedData ? feedData.pages.flatMap((p) => p.content) : [];

  return (
    <>
      {isFeedLoading && <div>로딩중...</div>}
      <BaseShortsTab
        algorithmList={videos}
        onRequireMoreVertical={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
      />
    </>
  );
}
