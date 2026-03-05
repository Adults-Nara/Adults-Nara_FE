import { loginWithKakao } from '@/services/auth.api';
import { useQuery } from '@tanstack/react-query';

export function useLoginWithKakao(code: string, state: string) {
  return useQuery({
    queryKey: ['kakaoLogin', code],
    queryFn: () => loginWithKakao(code, state),
    enabled: !!code,
    retry: false,
  });
}
