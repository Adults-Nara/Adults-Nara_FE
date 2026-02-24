import { DetailedVideoData } from '@/types/video';
import { VideoInfo } from './_components/VideoInfo';
import { VideoPlayer } from './_components/VideoPlayer';

const metadata: DetailedVideoData = {
  id: 's1',
  videoUrl:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  thumbnail:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
  likes: 1000,
  dislikes: 100,
  comments: 50,
  bookmarked: false,
  longformUrl: '',
  title: 'For Bigger Blazes',
  viewCount: 123456,
  uploadDate: '2023-01-01',
  uploader: {
    name: 'Sample Uploader',
    profileImg: null,
  },
  description: 'This is a sample video description.',
  tags: ['sample', 'video', 'test'],
};

export default function LongPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none shrink-0">
        <VideoPlayer
          src={metadata.videoUrl}
          thumbnail={metadata.thumbnail ?? undefined}
        />
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <VideoInfo data={metadata} />
      </div>
    </div>
  );
}
