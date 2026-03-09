'use client';

import { useState, useEffect, useRef } from 'react';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import { VirtualSwipePlayer } from './VirtualSwipePlayer'; // 방금 만든 컴포넌트
import { ShortTabActionButtons } from '@/app/(blank)/shorts/_components/ShortTabActionButtons';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { useVideoS3Url } from '@/lib/tanstack/query/video.query';
import {
  useUpdateWatchPosition,
  useStopWatching,
} from '@/lib/tanstack/mutation/watch-history.mutation';
interface BaseShortsTabProps {
  algorithmList: RecommendationVideoItem[];
  onRequireMoreVertical?: () => void;
}

export default function BaseShortsTab({
  algorithmList,
  onRequireMoreVertical,
}: BaseShortsTabProps) {
  const [vList, setVList] = useState<RecommendationVideoItem[]>(algorithmList);
  const lastAlgorithmLengthRef = useRef(algorithmList.length);
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [hList, setHList] = useState<RecommendationVideoItem[]>([]);

  // 페이징
  const FETCH_SIZE = 10; // api에 요청하는 개수
  const WINDOW_SIZE = 30; // 메모리에 담아둘 최대 개수

  useEffect(() => {
    // api로 algorithmList를 성공적으로 추가한 경우
    if (algorithmList.length > lastAlgorithmLengthRef.current) {
      const addedCount = algorithmList.length - lastAlgorithmLengthRef.current;
      lastAlgorithmLengthRef.current = algorithmList.length;

      // vList 업데이트
      setVList((prev) => {
        // 처음 리스트를 받아온 경우
        if (prev.length === 0) return algorithmList;

        // 기존 리스트에 추가
        const appended = [...prev, ...algorithmList.slice(-addedCount)];
        // 윈도우 사이즈보다 큰 경우, 앞 부분 WINDOW_SIZE만큼 삭제. 즉, FETCH_SIZE만큼 삭제
        if (appended.length > WINDOW_SIZE) {
          const cutSize = appended.length - WINDOW_SIZE;
          setRowIndex((r) => Math.max(0, r - cutSize)); // rowIndex offset 업데이트
          return appended.slice(cutSize);
        }
        return appended;
      });
    }
  }, [algorithmList]);

  const {
    data: relatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRelatedLoading,
  } = useRelatedVideosInfinite(vList[rowIndex]?.videoId, FETCH_SIZE);

  const lastRowIndexRef = useRef(rowIndex);
  const lastRelatedLengthRef = useRef(0);

  // 층(Row) 변경 시 또는 무한 스크롤 새 데이터 도달 시 가로 리스트 업데이트
  useEffect(() => {
    const source = vList[rowIndex];
    if (!source || isRelatedLoading || !relatedData) return;

    // 무한 쿼리에 담긴 모든 영상 (평탄화)
    const allRelated = relatedData.pages.flatMap((p) => p.content);

    // Row가 변경된 경우 초기화
    if (lastRowIndexRef.current !== rowIndex) {
      lastRowIndexRef.current = rowIndex;
      lastRelatedLengthRef.current = allRelated.length;
      setHList([source, ...allRelated]);
      return;
    }

    // api로 relatedData를 성공적으로 추가한 경우 (같은 Row에서 스크롤)
    if (allRelated.length > lastRelatedLengthRef.current) {
      const addedCount = allRelated.length - lastRelatedLengthRef.current;
      lastRelatedLengthRef.current = allRelated.length;

      // hList 업데이트
      setHList((prev) => {
        // 처음 리스트를 받아온 경우
        if (prev.length === 0) return [source, ...allRelated];

        // 기존 리스트에 추가
        const appended = [...prev, ...allRelated.slice(-addedCount)];

        // 윈도우 사이즈보다 큰 경우, 앞 부분 WINDOW_SIZE만큼 삭제 (즉, FETCH_SIZE만큼 삭제)
        if (appended.length > WINDOW_SIZE) {
          const cutSize = appended.length - WINDOW_SIZE;
          setColIndex((c) => Math.max(0, c - cutSize)); // colIndex offset 업데이트
          return appended.slice(cutSize);
        }
        return appended;
      });
    } else if (lastRelatedLengthRef.current === 0 && allRelated.length === 0) {
      // 해당 층 첫 렌더 시 연관 영상이 아직 없는 상태(추후 생기지 않는 경우 포함) 처리
      setHList([source]);
    }
  }, [rowIndex, vList, relatedData, isRelatedLoading]);

  // 이웃 영상들 도출
  const currentVideo = hList[colIndex];

  const upVideo = rowIndex > 0 ? vList[rowIndex - 1] : null;
  const downVideo = rowIndex < vList.length - 1 ? vList[rowIndex + 1] : null;
  const leftVideo = colIndex > 0 ? hList[colIndex - 1] : null;
  const rightVideo = colIndex < hList.length - 1 ? hList[colIndex + 1] : null;

  // VirtualSwipePlayer이 스와이프 완료를 알려주면 상태 업데이트
  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'up' || direction === 'down') {
      const nextRow = direction === 'down' ? rowIndex + 1 : rowIndex - 1;

      if (
        direction === 'down' &&
        nextRow >= vList.length - FETCH_SIZE &&
        onRequireMoreVertical
      ) {
        onRequireMoreVertical();
      }

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
      if (
        colIndex + 1 >= hList.length - FETCH_SIZE &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }
  };

  const { data: s3Data, isLoading: isS3Loading } = useVideoS3Url(
    currentVideo?.videoId, // Will be skipped internally if undefined
  );
  const s3Url = s3Data?.masterUrl;

  const { mutate: updatePosition } = useUpdateWatchPosition(
    currentVideo ? Number(currentVideo.videoId) : 0,
  );

  const handleWatchProgressUpdate = (currentTime: number) => {
    updatePosition({ lastPosition: currentTime });
  };

  const { mutate: stopWatching } = useStopWatching();

  const handleStopWatching = (
    video: RecommendationVideoItem,
    watchTime: number,
  ) => {
    stopWatching({
      videoId: Number(video.videoId),
      body: { lastPosition: watchTime },
    });
  };

  if (!currentVideo) {
    return (
      <div className="relative flex h-dvh w-full items-center justify-center bg-black">
        <svg className="h-10 w-10 animate-spin text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <VirtualSwipePlayer<RecommendationVideoItem>
      currentVideo={currentVideo}
      upVideo={upVideo}
      downVideo={downVideo}
      leftVideo={leftVideo}
      rightVideo={rightVideo}
      videoUrl={s3Url}
      videoLoading={isS3Loading}
      getThumbnailUrl={(v) => v.thumbnailUrl}
      watchProgress={currentVideo.watchProgress ?? 0}
      onWatchProgressUpdate={handleWatchProgressUpdate}
      onStopWatching={handleStopWatching}
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
