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
    <div className="flex flex-col">
      <VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" />
      <VideoInfo data={metadata} />
    </div>
  );
}
