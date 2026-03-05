'use client';
import { useLoginKakaoUrl } from '@/lib/tanstack/mutation/auth.mutation';
import { Kakao } from '@repo/ui';

const LoginButton = () => {
  const { mutate: getLoginUrl, isPending } = useLoginKakaoUrl();

  return (
    <button
      onClick={() => getLoginUrl()}
      disabled={isPending}
      className={`cursor-pointer transition-transform active:scale-95 ${isPending ? 'opacity-50' : ''}`}
    >
      <Kakao className="h-12 w-75" />
    </button>
  );
};

export default LoginButton;
