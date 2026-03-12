import { Suspense } from 'react';
import RecommendedSection from '@/app/(all)/home/_components/RecommendedSection';
import { VideoInfoManager } from './_components/VideoInfoManager';
import { VideoPlaybackManager } from './_components/VideoPlaybackManager';

export default function LongPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none shrink-0">
        <VideoPlaybackManager thumbnail={undefined} />
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <VideoInfoManager />

        {/* 추천 영상 */}
        <RecommendedSection />
      </div>
    </div>
  );
}
