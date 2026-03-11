import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '@/services/user.api';
import { UpdateUserRequest } from '@/models/user.model';

export function useUserDetail(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId,
  });
}
