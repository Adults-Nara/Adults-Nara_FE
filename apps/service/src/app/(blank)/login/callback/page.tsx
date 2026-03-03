'use client';

import { useEffect } from 'react';
import { useLoginWithKakao } from '@/lib/tanstack/query/auth.query';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constant/routes';
import { useRouter, useSearchParams } from 'next/navigation';

const KakaoCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const state = searchParams.get('state') ?? '';

  const { setAccessToken } = useAuthStore();

  const { data, isSuccess, isError } = useLoginWithKakao(code, state);

  useEffect(() => {
    if (isSuccess) {
      setAccessToken(data.accessToken);
      router.replace(ROUTES.HOME);
    }
  }, [isSuccess, data, setAccessToken, router]);

  if (isError)
    return (
      <div className="flex h-screen items-center justify-center">
        로그인 실패. 다시 시도해 주세요.
      </div>
    );

  return (
    <div className="flex h-screen items-center justify-center">
      <p>로그인 처리 중입니다. 잠시만 기다려주세요...</p>
    </div>
  );
};

export default KakaoCallbackPage;
