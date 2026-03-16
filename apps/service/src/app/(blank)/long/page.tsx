import { VideoInfoManager } from './_components/VideoInfoManager';
import { VideoPlaybackManager } from './_components/VideoPlaybackManager';
import RecommendedRelatedSection from './_components/RecommendedRelatedSection';

export default function LongPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none shrink-0">
        <VideoPlaybackManager />
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <VideoInfoManager />

        {/* 추천 영상 */}
        <RecommendedRelatedSection />
      </div>
    </div>
  );
}
