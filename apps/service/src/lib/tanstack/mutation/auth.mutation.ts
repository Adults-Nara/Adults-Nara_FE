import { useMutation } from '@tanstack/react-query';
import { loginKakaoUrl } from '@/services/auth.api';

export function useLoginKakaoUrl() {
  return useMutation({
    mutationFn: loginKakaoUrl,
    onSuccess: (data) => {
      console.log('url', data);
      window.location.href = data;
    },
    onError: (error) => {
      console.error('로그인 URL 요청 실패:', error);
      alert('카카오 로그인 페이지를 불러올 수 없습니다.');
    },
  });
}
