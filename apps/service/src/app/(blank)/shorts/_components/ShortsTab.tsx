'use client';

import { ShortFormVideoData } from '@/types/video';
import { useRef, useState, useEffect } from 'react';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import { ShortTabActionButtons } from './ShortTabActionButtons';
import { VideoInfoSection } from '@/components/shortForm/VideoInfoSection';
import BaseShortsTab from '@/components/shortForm/BaseShortsTab';

export default function ShortsTab({
  algorithmList,
}: {
  algorithmList: ShortFormVideoData[];
}) {
  return <BaseShortsTab algorithmList={algorithmList} />;
}
