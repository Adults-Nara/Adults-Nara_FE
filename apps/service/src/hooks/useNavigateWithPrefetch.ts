import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routes';
import { useState } from 'react';
import { feedVideoQueryOptions } from '@/lib/tanstack/query/recommendation.query';
import { videoS3UrlQueryOptions } from '@/lib/tanstack/query/video.query';

export function useNavigateWithPrefetch() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToShorts = async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      const feedData = await queryClient.fetchInfiniteQuery(
        feedVideoQueryOptions(10),
      );

      // 2. 첫 번째 비디오 ID 추출
      const firstVideo = feedData.pages[0]?.content[0];
      if (firstVideo?.videoId) {
        await queryClient.prefetchQuery(
          videoS3UrlQueryOptions(String(firstVideo.videoId)),
        );
      }

      // 4. 프리패치 완료 즉시 라우팅
      router.push(ROUTES.SHORTS);
    } catch (error) {
      console.error('Failed to prefetch shorts:', error);
      // 에러 발생 시에도 일단 넘겨서 로딩 화면을 보여주도록 폴백 처리
      router.push(ROUTES.SHORTS);
    } finally {
      setIsNavigating(false);
    }
  };

  return { navigateToShorts, isNavigating };
}
