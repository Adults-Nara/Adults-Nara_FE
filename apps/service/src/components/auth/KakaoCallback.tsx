'use client';
import { ROUTES } from '@/constant/routes';
import { useLoginWithKakao } from '@/lib/tanstack/query/auth.query';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, Spinner } from '@repo/ui';
import { CircleX } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
      if (data.onboardingCompleted) {
        router.replace(ROUTES.HOME);
      } else {
        router.replace(ROUTES.ONBOARDING);
      }
    }
  }, [isSuccess, data, setAccessToken, router]);

  if (isError)
    return (
      <div className="text-primary-500 flex flex-col items-center justify-center gap-3 py-5">
        <div className="mb-2">
          <CircleX size={35} />
        </div>
        <span className="title2">로그인 중 에러 발생</span>
        <Button
          onClick={() => router.replace(ROUTES.LOGIN)}
          variant={'outline'}
          className="w-fit"
        >
          로그인화면으로
        </Button>
      </div>
    );

  return (
    <>
      <Spinner size={50} />
    </>
  );
};

export default KakaoCallback;
