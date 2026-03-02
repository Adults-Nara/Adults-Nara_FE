'use client';
import { ROUTES } from '@/constant/routes';
import { Button, Input, Logo } from '@repo/ui';
import Link from 'next/link';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  return (
    <div className="flex h-162.5 w-125 min-w-125 flex-col items-center justify-center gap-8 rounded-lg border border-gray-500 bg-white px-12.5 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex w-full flex-col items-center gap-5">
        <Logo className="h-23 w-23" />
        <div className="flex flex-col items-center gap-3">
          <span className="title2">어르신나라 관리자 페이지</span>
          <span className="body2 text-gray-700">
            업로드 계정으로 로그인하세요
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-5">
        <label>
          이메일
          <Input className="mt-2" placeholder="admin@example.com" />
        </label>
        <label>
          비밀번호
          <Input
            className="mt-2"
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
        </label>
      </div>

      <div className="flex w-full flex-col items-center gap-7">
        <Button type="submit">로그인</Button>
        <span className="title3 text-gray-700">
          업로드 계정이 없으신가요?
          <Link href={ROUTES.SIGN_UP} className="text-primary-500 ml-2">
            회원가입
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
