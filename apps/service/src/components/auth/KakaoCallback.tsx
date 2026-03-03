'use client';
import { ROUTES } from '@/constant/routes';
import { useLoginWithKakao } from '@/lib/tanstack/query/auth.query';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface KakaoCallback {
  code: string;
  state: string;
}

const KakaoCallback = ({ code, state }: KakaoCallback) => {
  const router = useRouter();

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
      <>
        <p>로그인 실패. 다시 시도해 주세요.</p>
        <Button
          onClick={() => router.replace(ROUTES.LOGIN)}
          variant={'outline'}
          className="w-fit"
        >
          로그인화면으로
        </Button>
      </>
    );

  return (
    <>
      <p>로그인 처리 중입니다. 잠시만 기다려주세요...</p>
      <Button
        onClick={() => router.replace(ROUTES.LOGIN)}
        variant={'outline'}
        className="w-fit"
      >
        로그인화면으로
      </Button>
    </>
  );
};

export default KakaoCallback;
