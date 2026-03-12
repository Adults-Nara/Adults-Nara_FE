'use client';
import { ROUTES } from '@/constant/routes';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { Button } from '@repo/ui';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthGuide = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center px-6">
        <div className="w-full rounded-xl bg-gray-100 p-8 text-center shadow-sm">
          <div className="mb-4 flex w-full justify-center">
            <Lock size={40} />
          </div>
          <h2 className="title1 mb-2">로그인이 필요합니다.</h2>
          <p className="mb-8 leading-relaxed text-gray-700">
            로그인하시면 시청 기록과
            <br />
            관심 있는 영상을 확인하실 수 있어요.
          </p>

          <Button onClick={() => router.push(ROUTES.LOGIN)}>
            로그인하러 가기
          </Button>

          <Link
            href={ROUTES.HOME}
            className="body2 hover:text-primary-600 mt-4 block w-full py-2 text-gray-700"
          >
            나중에 할게요
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthGuide;
