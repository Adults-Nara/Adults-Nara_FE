import { LoginButton } from '@/components/auth';
import { ROUTES } from '@/constant/routes';
import { Logo } from '@repo/ui';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-20 bg-gray-100">
      <div className="flex flex-col items-center justify-center">
        <Logo className="h-50 w-50" />
        <span className="title2 text-gray-700">당신을 위한 영상 플랫폼</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-7">
        <LoginButton />
        <Link
          href={ROUTES.HOME}
          className="body2 hover:text-primary-600 block w-full py-2 text-center text-gray-700"
        >
          로그인없이 둘러보기
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
