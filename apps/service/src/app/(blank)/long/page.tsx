import { Suspense } from 'react';
import RecommendedSection from '@/app/(all)/home/_components/RecommendedSection';
import { VideoInfoManager } from './_components/VideoInfoManager';
import { VideoPlaybackManager } from './_components/VideoPlaybackManager';

export default function LongPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none shrink-0">
        {/* Suspense로 감싸 검색 파라미터를 읽는 클라이언트 컴포넌트를 분리 (깜빡임 방지) */}
        <Suspense fallback={<div className="h-full w-full bg-black"></div>}>
          <VideoPlaybackManager thumbnail={undefined} />
        </Suspense>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        {/* Suspense로 감싸 검색 파라미터를 읽는 클라이언트 컴포넌트를 분리 */}
        <Suspense fallback={<div className="p-3">정보를 불러오는 중...</div>}>
          <VideoInfoManager />
        </Suspense>

        {/* 추천 영상 */}
        <RecommendedSection />
      </div>
    </div>
  );
}
