'use client';
import { ROUTES } from '@/constant/routes';
import {
  useBackofficeCheckEmail,
  useBackofficeSign,
} from '@/lib/tanstack/mutation/auth.mutation';
import { toast } from '@/lib/toast';
import { BackofficeSignRequest } from '@/models/auth.model';
import { Button, Input, Logo } from '@repo/ui';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignFormUIValues extends BackofficeSignRequest {
  passwordConfirm: string;
}

const SignForm = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();
  const { mutate: signMutate, isPending: signPending } = useBackofficeSign();
  const { mutate: checkMutate, isPending: checkPending } =
    useBackofficeCheckEmail();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignFormUIValues>({
    mode: 'onBlur',
  });

  const password = watch('password');

  //중복 확인 핸들러
  const checkEmailDuplicate = async () => {
    const emailValue = watch('email');
    if (!emailValue) {
      setError('email', {
        type: 'manual',
        message: '이메일을 먼저 입력해주세요.',
      });
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(emailValue)) {
      setError('email', {
        type: 'manual',
        message: '이메일 형식이 올바르지 않습니다.',
      });
      return;
    }

    checkMutate(emailValue, {
      onSuccess: (res) => {
        if (res) {
          setIsEmailVerified(true);
          clearErrors('email');
          toast.success('사용 가능한 이메일입니다.');
        } else {
          setError('email', {
            type: 'manual',
            message: '이미 사용 중인 이메일입니다.',
          });
          setIsEmailVerified(false);
        }
      },
      onError: () => {
        toast.error('이메일 중복확인 오류');
      },
    });
  };

  const onSubmit = (data: SignFormUIValues) => {
    if (!isEmailVerified) {
      setError('email', {
        type: 'manual',
        message: '이메일 중복 확인이 필요합니다.',
      });
      return;
    }

    const { passwordConfirm, ...submitData } = data;
    signMutate(submitData, {
      onSuccess: () => {
        toast.success('회원가입에 성공하였습니다.');
        router.push(ROUTES.LOGIN);
      },
      onError: () => {
        toast.error('회원가입중 오류가 발생하였습니다.');
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-125 min-w-125 flex-col items-center justify-center gap-8 rounded-lg border border-gray-500 bg-white px-12.5 py-5 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)]"
    >
      <div className="flex w-full flex-col items-center gap-5">
        <Logo className="h-23 w-23" />
        <div className="flex flex-col items-center gap-3">
          <span className="title2">회원가입</span>
          <span className="body2 text-gray-700">업로드 계정을 생성하세요</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-5">
        <label>
          이메일
          <div className="mt-2 flex items-start gap-0.5">
            <Input
              className="w-73"
              placeholder="admin@example.com"
              {...register('email', {
                required: '이메일은 필수입니다.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: '이메일 형식이 올바르지 않습니다.',
                },
                onChange: () => setIsEmailVerified(false),
              })}
              error={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
            <Button
              disabled={checkPending}
              type="button"
              className="body2"
              onClick={checkEmailDuplicate}
            >
              중복 확인
            </Button>
          </div>
        </label>
        <label>
          비밀번호
          <Input
            className="mt-2"
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: { value: 6, message: '6자 이상 입력해주세요.' },
            })}
            error={!!errors.password}
            errorMessage={errors.password?.message as string}
          />
        </label>
        <label>
          비밀번호 확인
          <Input
            className="mt-2"
            type="password"
            placeholder="동일한 비밀번호를 입력하세요"
            {...register('passwordConfirm', {
              required: '비밀번호 확인이 필요합니다.',
              validate: (value) =>
                value === password || '비밀번호가 일치하지 않습니다.',
            })}
            error={!!errors.passwordConfirm}
            errorMessage={errors.passwordConfirm?.message as string}
          />
        </label>
        <label>
          닉네임
          <Input
            className="mt-2"
            placeholder="닉네임을 입력하세요"
            {...register('nickname', { required: '닉네임을 입력해주세요.' })}
            error={!!errors.nickname}
            errorMessage={errors.nickname?.message as string}
          />
        </label>
      </div>

      <div className="flex w-full flex-col items-center gap-7">
        <Button disabled={signPending} type="submit">
          {signPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {signPending ? '회원가입 중...' : '회원가입'}
        </Button>
        <span className="title3 text-gray-700">
          이미 계정이 있으신가요?
          <Link href={ROUTES.LOGIN} className="text-primary-500 ml-2">
            로그인
          </Link>
        </span>
      </div>
    </form>
  );
};

export default SignForm;
