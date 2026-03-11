import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginKakaoUrl, userLogout } from '@/services/auth.api';
import { ROUTES } from '@/constant/routes';
import { useAuthStore } from '@/store/useAuthStore';

export function useLoginKakaoUrl() {
  return useMutation({
    mutationFn: loginKakaoUrl,
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      console.error('로그인 URL 요청 실패:', error);
      alert('카카오 로그인 페이지를 불러올 수 없습니다.');
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
      //TODO:토스트로 변경
      console.log('로그아웃성공');
      window.location.href = ROUTES.LOGIN;
    },
    onError: (error) => {
      console.error('로그아웃 요청 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해 주세요');
    },
  });
}
