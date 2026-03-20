'use client';

import {
  useState,
  useEffect,
  useRef,
  startTransition,
  useCallback,
  useMemo,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import {
  VirtualSwipePlayer,
  VirtualSwipePlayerProps,
} from './VirtualSwipePlayer'; // 방금 만든 컴포넌트
import { mapRecommendationToShortsData } from '@/utils/videoMapper';
import { ShortTabActionButtons } from '@/app/(blank)/shorts/_components/ShortTabActionButtons';
import { ShortFormVideoData } from '@/types/video';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import {
  useVideoDetail,
  useVideoS3Url,
  videoS3UrlQueryOptions,
} from '@/lib/tanstack/query/video.query';
import {
  useUpdateWatchPosition,
  useStopWatching,
} from '@/lib/tanstack/mutation/watch-history.mutation';
import { LoadingSpinner } from '../LoadingSpinner';
import { useIsLoggedIn } from '@/store/useAuthStore';

// 슬라이딩 윈도우 상수
const MAX_BACK_BUFFER = 10; // 현재 위치 뒤로 유지할 최대 개수
const WINDOW_SIZE = 30; // 메모리에 담아둘 최대 개수
const PREFETCH_THRESHOLD = 15; // 앞으로 남은 영상이 이 이하이면 다음 페이지 요청

interface BaseShortsTabProps {
  algorithmList: ShortFormVideoData[];
  onRequireMoreVertical?: () => void;
}

export default function BaseShortsTab({
  algorithmList,
  onRequireMoreVertical,
}: BaseShortsTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [vList, setVList] = useState<ShortFormVideoData[]>(algorithmList);
  const lastAlgorithmLengthRef = useRef(algorithmList.length);
  const [rowIndex, setRowIndex] = useState(() => {
    const targetId = searchParams.get('v');
    if (!targetId) return 0; // 파라미터가 없으면 0층부터

    const targetIndex = algorithmList.findIndex(
      (video) => String(video.videoId) === targetId,
    );

    // 리스트에서 타겟 영상을 찾으면 그 층수부터, 못 찾으면 0층부터 시작
    return targetIndex !== -1 ? targetIndex : 0;
  });
  const [colIndex, setColIndex] = useState(0);
  const [hList, setHList] = useState<ShortFormVideoData[]>([]);

  const sourceVideoIdRef = useRef<string>(vList[rowIndex]?.videoId);
  const { data: realTimeDetail } = useVideoDetail(hList[colIndex]?.videoId);
  const isLogin = useIsLoggedIn();
  const queryClient = useQueryClient();

  const FETCH_SIZE = 10; // api에 요청하는 개수

  useEffect(() => {
    // api로 algorithmList를 성공적으로 추가한 경우
    if (algorithmList.length > lastAlgorithmLengthRef.current) {
      const addedCount = algorithmList.length - lastAlgorithmLengthRef.current;
      lastAlgorithmLengthRef.current = algorithmList.length;

      setVList((prev) => {
        if (prev.length === 0) return algorithmList;

        const newItems = algorithmList.slice(-addedCount);
        const appended = [...prev, ...newItems];

        // WINDOW_SIZE 초과 시 앞에서 제거 (안전장치 — 평소엔 handleSwipe에서 관리)
        if (appended.length > WINDOW_SIZE) {
          const excess = appended.length - WINDOW_SIZE;
          setRowIndex((r) => Math.max(0, r - excess));
          return appended.slice(excess);
        }
        return appended;
      });
    }
  }, [algorithmList]);

  const lastRequestedRowRef = useRef<number>(-1);

  // 현재 rowIndex가 화면에 아직 로드되지 않은 인덱스를 받아와야하는 경우,
  useEffect(() => {
    // 다음 페이지를 계속 요청하도록 처리 (아래 방향)
    if (rowIndex >= vList.length && onRequireMoreVertical) {
      if (lastRequestedRowRef.current !== rowIndex) {
        lastRequestedRowRef.current = rowIndex;
        onRequireMoreVertical();
      }
    } else if (rowIndex < vList.length) {
      // 데이터가 정상적으로 들어오면 락 해제
      lastRequestedRowRef.current = -1;
    }
  }, [rowIndex, vList.length, onRequireMoreVertical]);

  const {
    data: relatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRelatedLoading,
  } = useRelatedVideosInfinite(sourceVideoIdRef.current, FETCH_SIZE);

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

      setHList((prev) => {
        if (prev.length === 0) return [source, ...allRelated];

        const newItems = allRelated.slice(-addedCount);
        const appended = [...prev, ...newItems];

        if (appended.length > WINDOW_SIZE) {
          const excess = appended.length - WINDOW_SIZE;
          setColIndex((c) => Math.max(0, c - excess));
          return appended.slice(excess);
        }
        return appended;
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

  // 실시간 영상 정보와 현재 영상을 합치는 로직 (tags, comments)
  const mergedCurrentVideo = useMemo(() => {
    if (!currentVideo) return null;

    // 현재 영상의 상세 정보가 불러와졌고, ID가 일치하는 경우에만 병합
    if (realTimeDetail && realTimeDetail.videoId === currentVideo.videoId) {
      return {
        ...currentVideo,
        tags: [
          ...(realTimeDetail.tagIds ?? []),
          ...(realTimeDetail.aiTagIds ?? []),
        ],
        comments: realTimeDetail.commentCount,
      };
    }

    return currentVideo;
  }, [currentVideo, realTimeDetail]);

  // URL Shallow Routing (비디오 ID 동기화)
  useEffect(() => {
    if (!currentVideo?.videoId) return;

    // 현재 URL 파라미터가 이미 이 비디오를 가리키고 있는지 확인 (불필요한 history.replace 방지)
    const currentParam = searchParams.get('v');
    if (currentParam === String(currentVideo.videoId)) return;

    // 히스토리 조작 시 리렌더링 없이 URL만 업데이트 (Next.js native shallow routing)
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('v', String(currentVideo.videoId));
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${newParams.toString()}`,
    );
  }, [currentVideo?.videoId, pathname, router, searchParams]);

  const upVideo = rowIndex > 0 ? vList[rowIndex - 1] : null;
  const downVideo = rowIndex < vList.length - 1 ? vList[rowIndex + 1] : null;
  const leftVideo = colIndex > 0 ? hList[colIndex - 1] : null;
  const rightVideo = colIndex < hList.length - 1 ? hList[colIndex + 1] : null;

  // 인접 영상 S3 URL 미리 가져오기 (비디오 멈춤 현상(Autoplay block) 방지)
  useEffect(() => {
    [upVideo, downVideo, leftVideo, rightVideo].forEach((v) => {
      if (v?.videoId) {
        queryClient.prefetchQuery(videoS3UrlQueryOptions(String(v.videoId)));
      }
    });
  }, [upVideo, downVideo, leftVideo, rightVideo, queryClient]);

  // VirtualSwipePlayer이 스와이프 완료를 알려주면 상태 업데이트
  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'down') {
      // 가로 영상 보던 중이었다면 vList 해당 행 복원
      let baseList = vList;
      if (colIndex !== 0) {
        baseList = [...vList];
        baseList[rowIndex] = hList[colIndex];
      }

      let newList = baseList;
      let newRowIndex = rowIndex + 1;

      // 슬라이딩 윈도우: 뒤 버퍼가 MAX_BACK_BUFFER를 초과하면 앞에서 1개 제거
      // index는 그대로 MAX_BACK_BUFFER로 유지 (리스트가 앞으로 당겨짐)
      if (rowIndex >= MAX_BACK_BUFFER) {
        newList = baseList.slice(1);
        newRowIndex = rowIndex; // slice(1)로 인해 실질적으로 다음 영상을 가리킴
      }

      sourceVideoIdRef.current = newList[newRowIndex]?.videoId;

      // 앞으로 남은 영상이 PREFETCH_THRESHOLD 이하이면 다음 페이지 미리 요청
      const remaining = newList.length - newRowIndex - 1;
      if (remaining <= PREFETCH_THRESHOLD && onRequireMoreVertical) {
        onRequireMoreVertical();
      }

      setVList(newList);
      fetchNextPage(); // 다음 행의 연관 영상 프리패치
      startTransition(() => {
        setRowIndex(newRowIndex);
        setColIndex(0);
      });
    } else if (direction === 'up') {
      // 가로 영상 보던 중이었다면 vList 해당 행 복원
      if (colIndex !== 0) {
        setVList((prev) => {
          const newList = [...prev];
          newList[rowIndex] = hList[colIndex];
          return newList;
        });
      }

      const newRowIndex = rowIndex - 1;
      sourceVideoIdRef.current = vList[newRowIndex]?.videoId;
      fetchNextPage();
      startTransition(() => {
        setRowIndex(newRowIndex);
        setColIndex(0);
      });
    } else if (direction === 'left') {
      startTransition(() => {
        setColIndex((prev) => prev - 1);
      });
    } else if (direction === 'right') {
      startTransition(() => {
        setColIndex((prev) => prev + 1);
      });
      if (
        colIndex + 1 >= hList.length - 5 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }
  };

  const {
    data: s3Data,
    isPending: isS3Pending,
    isError: isS3Error,
  } = useVideoS3Url(mergedCurrentVideo?.videoId);
  const rawS3Url = s3Data?.masterUrl;
  // stream.asinna.store를 /stream/ 프록시로 치환 → CORS 우회 (next.config.ts rewrites)
  const s3Url =
    process.env.NODE_ENV === 'development'
      ? rawS3Url?.replace(process.env.NEXT_PUBLIC_STREAM_DOMAIN!, '/stream')
      : rawS3Url;

  const { mutate: updatePosition } = useUpdateWatchPosition(
    mergedCurrentVideo?.videoId ?? '0',
  );

  const handleStartWatching = (_videoId: string, watchSeconds: number) => {
    updatePosition({ lastPosition: 0, watchSeconds: watchSeconds });
  };

  const handleWatchProgressUpdate = useCallback(
    (currentTime: number, watchSeconds: number) => {
      if (!isLogin) return;
      updatePosition({ lastPosition: currentTime, watchSeconds: watchSeconds });
    },
    [updatePosition],
  );

  const { mutate: stopWatching } = useStopWatching();

  const markAdAsRewarded = (videoId: string) => {
    const update = (list: ShortFormVideoData[]) =>
      list.map((v) => (v.videoId === videoId ? { ...v, isRewarded: true } : v));
    setVList(update);
    setHList(update);
  };

  const handleStopWatching = (
    videoId: string,
    lastTime: number,
    watchSeconds: number,
  ) => {
    const video =
      vList.find((v) => v.videoId === videoId) ??
      hList.find((v) => v.videoId === videoId);

    if (video?.isRewarded) return;

    if (isLogin) {
      stopWatching({
        videoId,
        body: { lastPosition: lastTime, watchSeconds: watchSeconds },
      });

      if (video?.isAd && Math.floor(lastTime) >= Math.floor(video.duration)) {
        markAdAsRewarded(videoId);
      }
    }
  };

  if (
    !mergedCurrentVideo ||
    mergedCurrentVideo.videoId === undefined ||
    isS3Pending
  ) {
    return (
      <div className="h-dvh">
        <LoadingSpinner
          thumbnail={mergedCurrentVideo?.thumbnail || undefined}
        />
      </div>
    );
  } else {
    const virtualSwipePlayerProps: VirtualSwipePlayerProps = {
      currentVideo: mergedCurrentVideo,
      upVideo,
      downVideo,
      leftVideo,
      rightVideo,
      hasNextPage: !!onRequireMoreVertical,
      videoUrl: s3Url,
      videoLoading: isS3Pending || isS3Error,
      videoError: isS3Error,

      getThumbnailUrl: (v) => v.thumbnail,
      watchProgress: mergedCurrentVideo.watchProgress ?? 0,
      onStartWatching: handleStartWatching,
      onWatchProgressUpdate: handleWatchProgressUpdate,
      onStopWatching: handleStopWatching,
      onSwipe: handleSwipe,
      renderController: (videoToRender) => (
        <BaseShortFormController
          data={videoToRender}
          isReady={true}
          actionSlot={
            <ShortTabActionButtons
              videoId={videoToRender.videoId}
              isAd={videoToRender.isAd ?? false}
              commentNum={videoToRender.comments}
            />
          }
        />
      ),
    };

    return <VirtualSwipePlayer {...virtualSwipePlayerProps} />;
  }
}
