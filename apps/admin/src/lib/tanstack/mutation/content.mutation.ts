import { ContentUpload } from '@/services/content.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useContentUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
      ContentUpload(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contents'],
      });
    },
  });
}
