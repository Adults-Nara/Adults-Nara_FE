import { ShortFormVideoData, VideoData } from '../../../types/video';
import ShortsTab from './_components/ShortsTap';
import { ShortsHeader } from './_components/ShortsHeader';

// --- Mock Data ---
const ALGORITHM_VIDEOS = fetchAlgorithmVideo();

function fetchAlgorithmVideo(): ShortFormVideoData[] {
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
    isBookmarked: false,
    longformUrl: i % 2 === 0 ? `/watch/rel-${i}` : '',
  }));
}

export default function ShortsPage() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
      <ShortsHeader />

      {/* Vertical scroll container */}
      <ShortsTab algorithmList={ALGORITHM_VIDEOS} />
    </div>
  );
}
