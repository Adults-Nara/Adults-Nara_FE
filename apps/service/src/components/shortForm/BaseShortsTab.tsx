'use client';

import { ShortFormVideoData } from '@/types/video';
import { useState, useEffect } from 'react';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import { VirtualSwipePlayer } from './VirtualSwipePlayer'; // 방금 만든 컴포넌트
import { ShortTabActionButtons } from '@/app/(blank)/shorts/_components/ShortTabActionButtons';

interface BaseShortsTabProps {
  algorithmList: ShortFormVideoData[];
}

function fetchRelatedVideos(
  sourceVideo: ShortFormVideoData,
): ShortFormVideoData[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${sourceVideo.id}-rel-${i}`,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: '',
    uploader: { name: `related_${i + 1}`, profileImg: null },
    title: `${sourceVideo.title} 관련 ${i + 1}`,
    likes: (i + 1) * 80,
    dislikes: (i + 1) * 3,
    comments: (i + 1) * 15,
    isLiked: false,
    isBookmarked: false,
    longformUrl: '',
  }));
}

export default function BaseShortsTab({ algorithmList }: BaseShortsTabProps) {
  const [vList, setVList] = useState<ShortFormVideoData[]>(algorithmList);
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [hList, setHList] = useState<ShortFormVideoData[]>([]);

  // 층(Row) 변경 시 가로 리스트 업데이트
  useEffect(() => {
    const source = vList[rowIndex];
    if (source) {
      setHList([source, ...fetchRelatedVideos(source)]);
    }
  }, [rowIndex, vList]);

  // 이웃 영상들 도출
  const currentVideo = hList[colIndex];
  const upVideo = rowIndex > 0 ? vList[rowIndex - 1] : null;
  const downVideo = rowIndex < vList.length - 1 ? vList[rowIndex + 1] : null;
  const leftVideo = colIndex > 0 ? hList[colIndex - 1] : null;
  const rightVideo = colIndex < hList.length - 1 ? hList[colIndex + 1] : null;

  // 자식(VirtualSwipePlayer)이 스와이프 완료를 알려주면 상태 업데이트!
  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'up' || direction === 'down') {
      const nextRow = direction === 'down' ? rowIndex + 1 : rowIndex - 1;

      // 위아래로 층을 떠날 때, 가로 영상을 보던 중이었다면 원본 덮어씌우기
      if (colIndex !== 0) {
        setVList((prev) => {
          const newList = [...prev];
          newList[rowIndex] = hList[colIndex];
          return newList;
        });
      }
      setRowIndex(nextRow);
      setColIndex(0); // 새 층에선 무조건 원본(0번)
    } else if (direction === 'left') {
      setColIndex((prev) => prev - 1);
    } else if (direction === 'right') {
      setColIndex((prev) => prev + 1);
    }
  };

  if (!currentVideo) return null;

  return (
    <VirtualSwipePlayer
      currentVideo={currentVideo}
      upVideo={upVideo}
      downVideo={downVideo}
      leftVideo={leftVideo}
      rightVideo={rightVideo}
      onSwipe={handleSwipe}
      renderController={(currentVideo) => {
        return (
          <BaseShortFormController
            data={currentVideo}
            isReady={true}
            actionSlot={
              <ShortTabActionButtons
                key={`btn-${currentVideo.id}`}
                videoData={currentVideo}
              />
            }
          />
        );
      }}
    />
  );
}
