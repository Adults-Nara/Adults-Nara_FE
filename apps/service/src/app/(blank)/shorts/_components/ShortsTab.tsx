'use client';

import { ShortFormVideoData } from '@/types/video';
import BaseShortsTab from '@/components/shortForm/BaseShortsTab';
import { getRecommendationFeed } from '@/services/video.api';
import { useQuery } from '@tanstack/react-query';
import { useFeedVideo } from '@/lib/tanstack/query/video.query';

export default function ShortsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommendation-feed'],
    queryFn: getRecommendationFeed,
  });

  const { videos, isLoading: isLoadingRelated } = useFeedVideo();
  if (isLoading || isLoadingRelated) return <div>로딩중...</div>;
  return <BaseShortsTab algorithmList={videos} />;
}
