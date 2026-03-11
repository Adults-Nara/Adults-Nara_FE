import { Suspense } from 'react';
import { LongFormVideoData } from '@/types/video';
import RecommendedSection from '@/app/(all)/home/_components/RecommendedSection';
import { VideoInfoManager } from './_components/VideoInfoManager';
import { VideoPlaybackManager } from './_components/VideoPlaybackManager';

// 임시 더미 메타데이터
const metadata = {
  videoId: 's1',
  thumbnail:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
  title: 'For Bigger Blazes',
  viewCount: 123456,
  uploadDate: '2023-01-01',
  uploader: {
    name: 'Sample Uploader',
    profileImg: null,
  },
  comments: 50,
  likes: 1000,
  dislikes: 100,
  isLiked: null,
  isBookmarked: false,
  description: 'This is a sample video description.',
  tags: ['sample', 'video', 'test'],
} as LongFormVideoData;

export default function LongPage() {
  // 디테일 api 호출 (TODO) - 추후 VideoInfoManager 등으로 분리 권장

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none shrink-0">
        {/* Suspense로 감싸 검색 파라미터를 읽는 클라이언트 컴포넌트를 분리 (깜빡임 방지) */}
        <Suspense fallback={<div className="h-full w-full bg-black"></div>}>
          <VideoPlaybackManager thumbnail={metadata.thumbnail ?? undefined} />
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
