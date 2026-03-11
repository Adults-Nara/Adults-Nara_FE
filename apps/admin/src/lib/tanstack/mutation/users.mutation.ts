import { UsersDeleteRequest, UsersStatusRequest } from '@/models/users.model';
import { UsersDelete, UsersStatus } from '@/services/users.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUsersStatusUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UsersStatusRequest) => UsersStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}
export function useUsersDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UsersDeleteRequest) => UsersDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}
