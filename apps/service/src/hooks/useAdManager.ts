'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AdState } from '@/models/ad.model';
import { useAd } from '@/lib/tanstack/query/ad.query';
import { useVideoS3Url } from '@/lib/tanstack/query/video.query';
import { useStopWatching } from '@/lib/tanstack/mutation/watch-history.mutation';
import { useIsLoggedIn } from '@/store/useAuthStore';

const AD_PROBABILITY = 1;
const AD_FETCH_TIMEOUT_MS = 5000;

interface UseAdManagerReturn {
  adState: AdState;
  adVideoUrl: string | null;
  showRewardToast: boolean;
  onAdEnded: (duration: number) => void;
  onAdSkipped: () => void;
  onDismissToast: () => void;
}

export function useAdManager(videoId: number | null): UseAdManagerReturn {
  const [adState, setAdState] = useState<AdState>('IDLE');
  const [shouldFetchAd, setShouldFetchAd] = useState(false);
  const [showRewardToast, setShowRewardToast] = useState(false);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isLoggedIn = useIsLoggedIn();
  // 1. 광고 메타데이터 호출
  const { data: adData, isError: isAdError } = useAd(videoId, shouldFetchAd);

  // 💡 2. 광고 ID가 들어오면 즉시 연쇄적으로 S3 URL 호출 (React Query Chaining)
  const adId = adData?.videoId;
  const { data: s3Data, isError: isS3Error } = useVideoS3Url(
    adId?.toString() || undefined,
  );
  console.log(adData?.videoId);

  const rawS3Url = s3Data?.masterUrl;
  const adVideoUrl =
    process.env.NODE_ENV === 'development'
      ? rawS3Url?.replace(process.env.NEXT_PUBLIC_STREAM_DOMAIN!, '/stream')
      : rawS3Url;

  const { mutate: stopWatching } = useStopWatching();

  useEffect(() => {
    if (Math.random() < AD_PROBABILITY) {
      setAdState('FETCHING');
      setShouldFetchAd(true);

      fetchTimeoutRef.current = setTimeout(() => {
        setAdState('COMPLETED_OR_SKIPPED');
      }, AD_FETCH_TIMEOUT_MS);
    } else {
      setAdState('COMPLETED_OR_SKIPPED');
    }

    return () => clearTimeout(fetchTimeoutRef.current ?? undefined);
  }, []);

  // 3. 최종적으로 'URL'이 완성되었을 때 PLAYING으로 전환
  useEffect(() => {
    if (adVideoUrl) {
      clearTimeout(fetchTimeoutRef.current ?? undefined);
      setAdState('PLAYING');
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
            body: { lastPosition: duration },
          });
        }
        // TODO: 광고 시청 완료 토스트 노출 (보상 안내)
        console.log('광고 시청 완료! 보상 지급');
      } else {
        // TODO: 비로그인 상태인 경우, 로그인 유도 토스트 노출
        console.log('비로그인 상태입니다. 로그인을 해주세요.');
      }
      setAdState('COMPLETED_OR_SKIPPED');
    },
    [adData, stopWatching],
  );

  const onAdSkipped = useCallback(() => setAdState('COMPLETED_OR_SKIPPED'), []);
  const onDismissToast = useCallback(() => setShowRewardToast(false), []);

  return {
    adState,
    adVideoUrl: adVideoUrl || null, // 완벽하게 조립된 URL 반환!
    showRewardToast,
    onAdEnded,
    onAdSkipped,
    onDismissToast,
  };
}
