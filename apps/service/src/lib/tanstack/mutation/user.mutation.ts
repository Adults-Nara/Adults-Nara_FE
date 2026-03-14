import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, updateUser, deactivateUser } from '@/services/user.api';
import { UpdateUserRequest } from '@/models/user.model';
import { useAuthStore } from '@/store/useAuthStore';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthStore.getState();
  return useMutation({
    mutationFn: (reason: string) => deleteUser(reason),
    onSuccess: () => {
      queryClient.clear();
      setAccessToken(null);
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}
