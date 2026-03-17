import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginKakaoUrl,
  onBoardingComplete,
  userLogout,
} from '@/services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/lib/toast';

export function useLoginKakaoUrl() {
  return useMutation({
    mutationFn: loginKakaoUrl,
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(`'로그인 URL 요청 실패:${error}`);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthStore.getState();

  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.clear();
      setAccessToken(null);
    },
  });
}

export function useOnBoardingComplete() {
  return useMutation({
    mutationFn: onBoardingComplete,
  });
}
