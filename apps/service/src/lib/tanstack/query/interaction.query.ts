import { getMyInteractionStatus } from '@/services/interaction.api';
import { useQuery } from '@tanstack/react-query';

export function useInteraction(videoId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['interaction', videoId],
    queryFn: () => getMyInteractionStatus(Number(videoId)),
  });

  return {
    data,
    isLoading,
    isError,
  };
}
