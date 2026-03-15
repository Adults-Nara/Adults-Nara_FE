import { useQuery } from '@tanstack/react-query';
import { getAd } from '@/services/ad.api';

export function useAd(videoId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['ad', videoId],
    queryFn: () => getAd(videoId!),
    enabled: enabled && !!videoId,
    retry: false, // 실패 시 재시도 없이 즉시 fallback
    staleTime: 0,
  });
}
