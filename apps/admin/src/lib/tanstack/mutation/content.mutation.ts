import { ContentsStatusRequest } from '@/models/content.model';
import {
  ContentsDelete,
  ContentsEdit,
  ContentsStatusUpdate,
  ContentUpload,
} from '@/services/content.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useContentUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
      ContentUpload(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contents', 'list'],
      });
    },
  });
}

export function useContentEdit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
      ContentsEdit(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contents'],
      });
    },
  });
}

export function useContentDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { videoIds: string[] }) => ContentsDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contents', 'list'],
      });
    },
  });
}
export function useContentStatusUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContentsStatusRequest) => ContentsStatusUpdate(data),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['contents'],
      });
    },
  });
}
