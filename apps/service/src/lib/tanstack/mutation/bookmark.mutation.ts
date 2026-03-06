import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark, warmUpBookmarks } from '@/services/bookmark.api';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: number) => toggleBookmark(videoId),
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkStatus', videoId] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkSummary'] });
    },
  });
}

export function useWarmUpBookmarks() {
  return useMutation({
    mutationFn: () => warmUpBookmarks(),
  });
}
