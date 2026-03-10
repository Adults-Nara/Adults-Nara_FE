'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import {
  VirtualSwipePlayer,
  VirtualSwipePlayerProps,
} from './VirtualSwipePlayer'; // 방금 만든 컴포넌트
import { mapRecommendationToShortsData } from '@/utils/videoMapper';
import { ShortTabActionButtons } from '@/app/(blank)/shorts/_components/ShortTabActionButtons';
import { ShortFormVideoData } from '@/types/video';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { useVideoS3Url } from '@/lib/tanstack/query/video.query';
import {
  useUpdateWatchPosition,
  useStopWatching,
} from '@/lib/tanstack/mutation/watch-history.mutation';
import { LoadingSpinner } from '../LoadingSpinner';

// 무한 스크롤 메모리 초과 방지, window 형식. offset 보정 함수.
function applyWindowing<T>(
  prevList: T[],
  newItemsToAdd: T[],
  windowSize: number,
  setIndexOffset: React.Dispatch<React.SetStateAction<number>>,
): T[] {
  const appended = [...prevList, ...newItemsToAdd];
  if (appended.length <= windowSize) return appended;

  const cutSize = appended.length - windowSize;
  setIndexOffset((prevIndex) => Math.max(0, prevIndex - cutSize));
  return appended.slice(cutSize);
}

interface BaseShortsTabProps {
  algorithmList: ShortFormVideoData[];
  onRequireMoreVertical?: () => void;
}

export default function BaseShortsTab({
  algorithmList,
  onRequireMoreVertical,
}: BaseShortsTabProps) {
  const [vList, setVList] = useState<ShortFormVideoData[]>(algorithmList);
  const lastAlgorithmLengthRef = useRef(algorithmList.length);
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [hList, setHList] = useState<ShortFormVideoData[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 페이징
  const FETCH_SIZE = 10; // api에 요청하는 개수
  const WINDOW_SIZE = 30; // 메모리에 담아둘 최대 개수

  useEffect(() => {
    // api로 algorithmList를 성공적으로 추가한 경우
    if (algorithmList.length > lastAlgorithmLengthRef.current) {
      const addedCount = algorithmList.length - lastAlgorithmLengthRef.current;
      lastAlgorithmLengthRef.current = algorithmList.length;

      setVList((prev) => {
        // 처음 리스트를 받아온 경우
        if (prev.length === 0) return algorithmList;

        // 기존 리스트 뒤에 다음 페이지 영상 리스트가 추가된 경우
        const newItems = algorithmList.slice(-addedCount);
        return applyWindowing(prev, newItems, WINDOW_SIZE, setRowIndex);
      });
    }
  }, [algorithmList]);

  // 현재 rowIndex가 화면에 아직 로드되지 않은 인덱스를 바라보는 경우
  // 다음 페이지를 계속 요청하도록 처리 (아래 방향)
  useEffect(() => {
    if (rowIndex >= vList.length && onRequireMoreVertical) {
      onRequireMoreVertical();
    }
  }, [rowIndex, vList.length, onRequireMoreVertical]);

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
    if (!source) return;

    // 무한 쿼리에 담긴 모든 영상 (평탄화)
    const allRelated = relatedData?.pages
      ? relatedData.pages
          .flatMap((p) => p.content)
          .map(mapRecommendationToShortsData)
      : [];

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

        // 기존 리스트 뒤에 다음 페이지 영상 리스트가 추가된 경우
        const newItems = allRelated.slice(-addedCount);
        return applyWindowing(prev, newItems, WINDOW_SIZE, setColIndex);
      });
    } else if (
      lastRelatedLengthRef.current === 0 &&
      allRelated.length === 0 &&
      !isRelatedLoading
    ) {
      // 해당 층 첫 렌더 시 연관 영상이 아직 없는 상태(추후 생기지 않는 경우 포함) 처리
      setHList([source]);
    }
  }, [rowIndex, vList, relatedData, isRelatedLoading]);

  // 이웃 영상들 도출
  const currentVideo = hList[colIndex];

  // URL Shallow Routing (비디오 ID 동기화)
  useEffect(() => {
    if (!currentVideo?.videoId) return;

    // 현재 URL 파라미터가 이미 이 비디오를 가리키고 있는지 확인 (불필요한 history.replace 방지)
    const currentParam = searchParams.get('v');
    if (currentParam === String(currentVideo.videoId)) return;

    // 히스토리 조작 시 리렌더링 없이 URL만 업데이트 (Next.js native shallow routing)
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('v', String(currentVideo.videoId));
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [currentVideo?.videoId, pathname, router, searchParams]);

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

  const handleStartWatching = (videoId: number) => {
    updatePosition({ lastPosition: 0 });
  };

  const handleWatchProgressUpdate = (currentTime: number) => {
    updatePosition({ lastPosition: currentTime });
  };

  const { mutate: stopWatching } = useStopWatching();

  const handleStopWatching = (videoId: number, watchTime: number) => {
    stopWatching({
      videoId,
      body: { lastPosition: watchTime },
    });
  };

  if (
    !currentVideo ||
    currentVideo.videoId === ('loading' as string | number)
  ) {
    return <LoadingSpinner />;
  } else {
    const virtualSwipePlayerProps: VirtualSwipePlayerProps = {
      currentVideo,
      upVideo,
      downVideo,
      leftVideo,
      rightVideo,
      videoUrl: s3Url,
      videoLoading: isS3Loading,
      getThumbnailUrl: (v) => v.thumbnail,
      watchProgress: currentVideo.watchProgress ?? 0,
      onStartWatching: handleStartWatching,
      onWatchProgressUpdate: handleWatchProgressUpdate,
      onStopWatching: handleStopWatching,
      onSwipe: handleSwipe,
      renderController: (currentVideo) => (
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
      ),
    };

    return <VirtualSwipePlayer {...virtualSwipePlayerProps} />;
  }
}
