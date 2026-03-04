'use client';
import { ROUTES } from '@/constant/routes';
import { useBackofficeLogin } from '@/lib/tanstack/mutation/auth.mutation';
import { BackofficeLoginRequest } from '@/models/auth.model';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, Input, Logo } from '@repo/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BackofficeLoginRequest>();

  const { mutate, isPending } = useBackofficeLogin();
  const router = useRouter();
  const { setAccessToken } = useAuthStore.getState();

  const onSubmit = (data: BackofficeLoginRequest) => {
    mutate(data, {
      onSuccess: (res) => {
        setAccessToken(res.accessToken);
        router.push(ROUTES.CONTENT);
      },
      onError: (error) => {
        //TODO:추후 토스트
        console.error('로그인 실패:', error.message);
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-162.5 w-125 min-w-125 flex-col items-center justify-center gap-8 rounded-lg border border-gray-500 bg-white px-12.5 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)]"
    >
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
          <Input
            className="mt-2"
            placeholder="admin@example.com"
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: '이메일 형식이 올바르지 않습니다.',
              },
            })}
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </label>
        <label>
          비밀번호
          <Input
            className="mt-2"
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
            })}
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />
        </label>
      </div>

      <div className="flex w-full flex-col items-center gap-7">
        <Button type="submit" disabled={isPending}>
          로그인
        </Button>
        <span className="title3 text-gray-700">
          업로드 계정이 없으신가요?
          <Link href={ROUTES.SIGN_UP} className="text-primary-500 ml-2">
            회원가입
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
