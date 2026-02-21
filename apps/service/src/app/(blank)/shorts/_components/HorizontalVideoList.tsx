import { VideoData } from '@/types/video';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ShortCard } from './ShortCard';

interface HorizontalRowProps {
  sourceVideo: VideoData;
  isActiveRow: boolean;
  onHorizontalIndexChange: (index: number, video: VideoData) => void;
}

function fetchRelatedVideos(sourceVideo: VideoData): VideoData[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${sourceVideo.id}-rel-${i}`,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: '',
    uploader: {
      name: `related_${i + 1}`,
      profileImg: null,
    },
    title: `${sourceVideo.title} 관련 ${i + 1}`,
    likes: (i + 1) * 80,
    dislikes: (i + 1) * 3,
    comments: (i + 1) * 15,
    bookmarked: false,
    longformUrl: i % 2 === 0 ? `/watch/rel-${i}` : '',
  }));
}

// 가로 카드 리스트 컴포넌트 : 현재 행의 첫번째 영상 카테고리 관련 리스트 나열. 세로 스크롤시, 새로운 컴포넌트로 갱신.
export function HorizontalCardsArea({
  sourceVideo,
  isActiveRow,
  onHorizontalIndexChange,
}: HorizontalRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]); // sourceVideo 관련 영상 리스트
  const [horizontalIndex, setHorizontalIndex] = useState(0); // 가로 스크롤 인덱스 (0: sourceVideo, 1~n: relatedVideos)
  const allVideos = [sourceVideo, ...relatedVideos];

  // sourceVideo가 바뀔 때마다 관련 관련 영상 리스트 초기화
  useEffect(() => {
    if (isActiveRow) {
      const related = fetchRelatedVideos(sourceVideo);
      setRelatedVideos(related);
    }
  }, [isActiveRow, sourceVideo]);

  // activeRow가 아닐 때, 가로 스크롤 처음으로 초기화
  useEffect(() => {
    if (!isActiveRow && scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0 });
      setHorizontalIndex(0);
    }
  }, [isActiveRow]);

  // 가로 스크롤 핸들러 : 스크롤 위치에 따라 horizontalIndex 업데이트
  const handleHorizontalScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (
      newIndex !== horizontalIndex &&
      newIndex >= 0 &&
      newIndex < allVideos.length
    ) {
      const video = allVideos[newIndex];
      if (video) {
        setHorizontalIndex(newIndex);
        onHorizontalIndexChange(newIndex, video);
      }
    }
  }, [horizontalIndex, allVideos, onHorizontalIndexChange]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleHorizontalScroll, {
      passive: true,
    });
    return () =>
      container.removeEventListener('scroll', handleHorizontalScroll);
  }, [handleHorizontalScroll]);

  return (
    <div
      ref={scrollRef}
      className="custom-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-scroll"
    >
      {allVideos.map((video, i) => (
        <ShortCard
          key={video.id}
          data={video}
          isActive={isActiveRow && i === horizontalIndex}
        />
      ))}
    </div>
  );
}
