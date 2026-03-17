'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AdState } from '@/models/ad.model';
import { useAd } from '@/lib/tanstack/query/ad.query';
import { useVideoS3Url } from '@/lib/tanstack/query/video.query';
import { useStopWatching } from '@/lib/tanstack/mutation/watch-history.mutation';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { toast } from '@/lib/toast';

// TODO : 광고 노출 확률 수정
const AD_PROBABILITY = 1;
const AD_FETCH_TIMEOUT_MS = 5000;

interface UseAdManagerReturn {
  adState: AdState;
  adVideoUrl: string | null;
  onAdEnded: (duration: number) => void;
  onAdSkipped: () => void;
}

export function useAdManager(videoId: string | null): UseAdManagerReturn {
  const [adState, setAdState] = useState<AdState>('IDLE');
  const [shouldFetchAd, setShouldFetchAd] = useState(false);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isLoggedIn = useIsLoggedIn();
  // 1. 광고 메타데이터 호출
  const { data: adData, isError: isAdError } = useAd(videoId, shouldFetchAd);

  // 2. 광고 ID가 들어오면 즉시 연쇄적으로 S3 URL 호출 (React Query Chaining)
  const adId = adData?.videoId;
  const { data: s3Data, isError: isS3Error } = useVideoS3Url(
    adId?.toString() || undefined,
  );

  const rawS3Url = s3Data?.masterUrl;
  const adVideoUrl =
    process.env.NODE_ENV === 'development'
      ? rawS3Url?.replace(process.env.NEXT_PUBLIC_STREAM_DOMAIN!, '/stream')
      : rawS3Url;

  const {
    mutate: stopWatching,
    isPending: isStopWatchingPending,
    isError: isStopWatchingError,
  } = useStopWatching();

  useEffect(() => {
    // 1. 초기화: 새로운 영상이 오면 무조건 이전 상태를 리셋
    setAdState('IDLE');
    setShouldFetchAd(false);

    // 기존 타이머가 있다면 확실히 제거
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // 2. 새로운 광고 판단 로직 실행
    if (videoId && Math.random() < AD_PROBABILITY) {
      setAdState('FETCHING');
      setShouldFetchAd(true);

      fetchTimeoutRef.current = setTimeout(() => {
        setAdState('COMPLETED_OR_SKIPPED');
      }, AD_FETCH_TIMEOUT_MS);
    } else {
      // 광고 대상이 아니면 즉시 통과
      setAdState('COMPLETED_OR_SKIPPED');
    }

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [videoId]);

  // 3. 최종적으로 'URL'이 완성되었을 때 PLAYING으로 전환
  useEffect(() => {
    if (adState === 'FETCHING' && adVideoUrl) {
      clearTimeout(fetchTimeoutRef.current ?? undefined);
      setAdState('PLAYING');
    }
    if (!isLoggedIn) {
      toast.info('로그인 후 광고를 시청하시면 포인트를 받을 수 있습니다.');
    }
  }, [adVideoUrl]);

  // 에러 처리 (광고 API 에러 또는 S3 변환 에러)
  useEffect(() => {
    if (isAdError || (adId && isS3Error)) {
      clearTimeout(fetchTimeoutRef.current ?? undefined);
      setAdState('COMPLETED_OR_SKIPPED');
    }
  }, [isAdError, isS3Error, adId]);

  const onAdEnded = useCallback(
    (duration: number) => {
      if (isLoggedIn) {
        if (adData?.videoId) {
          stopWatching({
            videoId: adData.videoId,
            body: { lastPosition: duration, watchSeconds: duration },
          });
        }
        if (!isStopWatchingPending && !isStopWatchingError) {
          toast.success('포인트가 적립되었습니다.');
        } else {
          toast.error('포인트 적립 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
      setAdState('COMPLETED_OR_SKIPPED');
    },
    [adData, stopWatching],
  );

  const onAdSkipped = useCallback(() => setAdState('COMPLETED_OR_SKIPPED'), []);

  return {
    adState,
    adVideoUrl: adVideoUrl || null,
    onAdEnded,
    onAdSkipped,
  };
}
