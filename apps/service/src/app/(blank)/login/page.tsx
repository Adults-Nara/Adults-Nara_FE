import { LoginButton } from '@/components/auth';
import { Logo } from '@repo/ui';

const LoginPage = () => {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-20 bg-gray-100">
      <div className="flex flex-col items-center justify-center">
        <Logo className="h-50 w-50" />
        <span className="title2 text-gray-700">당신을 위한 영상 플랫폼</span>
      </div>

      <LoginButton />
    </div>
  );
};

export default LoginPage;
