'use client';

import { ShortFormVideoData } from '@/types/video';
import BaseShortsTab from '@/components/shortForm/BaseShortsTab';
import { useGetFeed } from '@project/api-client';
import { useState } from 'react';

async function fetchAlgorithmVideo(): Promise<ShortFormVideoData[]> {
  const { data } = useGetFeed();
  console.log(data);

  return Array.from({ length: 1 }, (_, i) => ({
    id: `s${i}`,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: '',
    uploader: {
      name: `user_${i + 1}`,
      profileImg: null,
    },
    title: `알고리즘 추천 영상 ${i + 1}`,
    likes: (i + 1) * 100,
    dislikes: (i + 1) * 5,
    comments: (i + 1) * 20,
    isBookmarked: false,
    longformUrl: i % 2 === 0 ? `/watch/rel-${i}` : '',
  }));
}

export default function ShortsTab() {
  const { data, isLoading } = useGetFeed({});
  if (!isLoading) {
    console.log('data', data);
  }
  return <BaseShortsTab isLoading={isLoading} algorithmList={[]} />;
}
