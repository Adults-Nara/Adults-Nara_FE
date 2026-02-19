'use client';

import { useState } from 'react';
import VideoPlayer from '../../../components/video_player';

interface PlaylistItem {
  url: string;
  title: string;
}

// 예시 playlist — S3 URL로 교체하세요
const PLAYLIST: PlaylistItem[] = [
  {
    url: 'https://your-bucket.s3.ap-northeast-2.amazonaws.com/video1.mp4',
    title: '첫 번째 영상',
  },
  {
    url: 'https://your-bucket.s3.ap-northeast-2.amazonaws.com/video2.mp4',
    title: '두 번째 영상',
  },
  {
    url: 'https://your-bucket.s3.ap-northeast-2.amazonaws.com/video3.mp4',
    title: '세 번째 영상',
  },
];

export default function PlayerPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <div className="w-full max-w-4xl space-y-4">
        {/* Player */}
        <VideoPlayer
          url={PLAYLIST[currentIndex].url}
          playlist={PLAYLIST}
          currentIndex={currentIndex}
        />
      </div>
    </div>
  );
}
