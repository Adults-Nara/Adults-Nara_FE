import { Close, SearchIcon } from '@repo/ui';
import { VideoData } from '../../../types/video';
import ShortsTab from './_components/ShortsTap';

// --- Mock Data ---
const ALGORITHM_VIDEOS = fetchAlgorithmVideo();

function fetchAlgorithmVideo(): VideoData[] {
  return Array.from({ length: 5 }, (_, i) => ({
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
    bookmarked: false,
    longformUrl: i % 2 === 0 ? `/watch/rel-${i}` : '',
  }));
}

export default function ShortsPage() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
      {/* 헤더 */}
      <div className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between bg-linear-to-b from-black/10 to-transparent px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3 text-[28px] text-white">
        <button className="drop-shadow-sm">
          <Close />
        </button>
        <button className="drop-shadow-sm">
          <SearchIcon />
        </button>
      </div>

      {/* Vertical scroll container */}
      <ShortsTab algorithmList={ALGORITHM_VIDEOS} />
    </div>
  );
}
