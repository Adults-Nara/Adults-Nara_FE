'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BaseShortsTab from '@/components/shortForm/BaseShortsTab';
import { useFeedVideoInfinite } from '@/lib/tanstack/query/recommendation.query';
import {
  useBookmarkListInfinite,
  useBookmarkStatus,
} from '@/lib/tanstack/query/bookmark.query';
import { useVideoDetail } from '@/lib/tanstack/query/video.query';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { BookmarkListResponse } from '@/models/bookmark.model';
import { ShortFormVideoData } from '@/types/video';
import {
  mapBookmarkToShortsData,
  mapVideoDetailToShortsData,
  mapRecommendationToShortsData,
} from '@/utils/videoMapper';

export interface ShortsTabProps {
  params: { v?: string; listType?: string };
}

export default function ShortsTab({ params }: ShortsTabProps) {
  const FETCH_SIZE = 10;
  const WINDOW_SIZE = 30;
  const router = useRouter();
  const isInitialMount = useRef(true);

  // URL에서 전달받은 파라미터 확인
  const isBookmark = params.listType === 'bookmarkList';
  const targetVideoId = params.v || null;

  // 1. 단건 영상 조회 (타겟 영상이 있을 경우)
  const { data: detailData, isLoading: detailLoading } = useVideoDetail(
    Number(targetVideoId),
  );

  // 2. 피드 또는 북마크 리스트 영상 무한 조회 (타겟 영상 이후 이어붙일 데이터)
  const feedQuery = useFeedVideoInfinite(FETCH_SIZE, !isBookmark);
  const bookmarkQuery = useBookmarkListInfinite(
    'SHORT',
    FETCH_SIZE,
    WINDOW_SIZE,
    0, // index 파라미터는 더 이상 무의미하므로 0부터 시작
  );

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    isBookmark ? bookmarkQuery : feedQuery;

  // 3. 북마크 리스트 조회 시, 현재 타겟 영상이 북마크에 포함되어 있는지 검증하는 단건 상태 조회
  const { data: bookmarkStatusData, isSuccess: bookmarkStatusSuccess } =
    useBookmarkStatus(isBookmark && targetVideoId ? Number(targetVideoId) : 0);

  // 북마크 검증 로직: 스와이프 도중 연관 영상 시 북마크 탭이 풀리는 현상 방지를 위해 최초 진입 시에만 검증
  useEffect(() => {
    if (
      isInitialMount.current &&
      isBookmark &&
      targetVideoId &&
      bookmarkStatusSuccess
    ) {
      if (bookmarkStatusData && !bookmarkStatusData.isBookmarked) {
        // 북마크 상태가 아니면 listType 파라미터를 떼고 일반 피드 모드로 즉시 라우팅 변경
        router.replace(`/shorts?v=${targetVideoId}`);
      }
      // 최초 검증이 완료되었으므로 이후 스와이프로 인한 URL 변경 시에는 검증 패스
      isInitialMount.current = false;
    }
  }, [
    isBookmark,
    targetVideoId,
    bookmarkStatusSuccess,
    bookmarkStatusData,
    router,
  ]);

  // 4. 데이터 조합 로직
  const videos: ShortFormVideoData[] = useMemo(() => {
    // 무한 쿼리에서 받아온 리스트 평탄화
    const rawVideos = isBookmark
      ? bookmarkQuery.data?.pages.flatMap((p) => p.items ?? []) || []
      : feedQuery.data?.pages.flatMap((p) => p.content ?? []) || [];

    let formattedVideos = isBookmark
      ? (rawVideos as BookmarkListResponse[]).map(mapBookmarkToShortsData)
      : (rawVideos as RecommendationVideoItem[]).map(
          mapRecommendationToShortsData,
        );

    // 단건 데이터가 존재하면 배열 맨 앞에 꽂고, 무한스크롤 데이터 중 중복 항목 제거
    if (targetVideoId && detailData) {
      const formattedDetail = mapVideoDetailToShortsData(detailData);

      formattedVideos = [
        formattedDetail,
        ...formattedVideos.filter((v) => v.videoId !== String(targetVideoId)),
      ];
    }

    return formattedVideos;
  }, [
    isBookmark,
    bookmarkQuery.data,
    feedQuery.data,
    targetVideoId,
    detailData,
  ]);

  return (
    <>
      {(isLoading || detailLoading) && <div>로딩중...</div>}
      <BaseShortsTab
        algorithmList={videos}
        onRequireMoreVertical={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
      />
    </>
  );
}
