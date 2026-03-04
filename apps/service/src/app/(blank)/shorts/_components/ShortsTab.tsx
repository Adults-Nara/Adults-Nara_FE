'use client';

import { ShortFormVideoData } from '@/types/video';
import BaseShortsTab from '@/components/shortForm/BaseShortsTab';

export default function ShortsTab({
  algorithmList,
}: {
  algorithmList: ShortFormVideoData[];
}) {
  return <BaseShortsTab algorithmList={algorithmList} />;
}
