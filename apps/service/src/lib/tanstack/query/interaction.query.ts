import { getMyInteractionStatus } from '@/services/interaction.api';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export function useInteraction(videoId: string) {
  const isLogin = useIsLoggedIn();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['interaction', videoId],
    queryFn: () => getMyInteractionStatus(videoId),
    enabled: isLogin && !!videoId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
