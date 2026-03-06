'use client';

import { useState, useEffect } from 'react';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import { VirtualSwipePlayer } from './VirtualSwipePlayer'; // 방금 만든 컴포넌트
import { ShortTabActionButtons } from '@/app/(blank)/shorts/_components/ShortTabActionButtons';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { useRelatedVideos } from '@/lib/tanstack/query/video.query';

interface BaseShortsTabProps {
  algorithmList: RecommendationVideoItem[];
}

export default function BaseShortsTab({ algorithmList }: BaseShortsTabProps) {
  const [vList, setVList] = useState<RecommendationVideoItem[]>(algorithmList);
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [hList, setHList] = useState<RecommendationVideoItem[]>([]);
  const { videos, isLoading } = useRelatedVideos(vList[rowIndex]?.videoId);

  // 층(Row) 변경 시 가로 리스트 업데이트
  useEffect(() => {
    const source = vList[rowIndex];
    if (!source || isLoading) return;
    setHList([source, ...videos]);
  }, [rowIndex, vList, videos, isLoading]);

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
                key={`btn-${currentVideo.videoId}`}
                videoId={currentVideo.videoId}
              />
            }
          />
        );
      }}
    />
  );
}
