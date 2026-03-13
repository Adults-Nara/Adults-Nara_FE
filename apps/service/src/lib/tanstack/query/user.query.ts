import { useQuery } from '@tanstack/react-query';
import { getUserDetail, getUserMe } from '@/services/user.api';
import { useIsLoggedIn } from '@/store/useAuthStore';

export function useUserDetail(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId,
  });
}

export function useUserMe() {
  const isLogin = useIsLoggedIn();
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => getUserMe(),
    enabled: isLogin,
  });
}
