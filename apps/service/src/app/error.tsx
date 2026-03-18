'use client';

import { ROUTES } from '@/constant/routes';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100">
      <TriangleAlert size={40} className="text-primary-500" />

      <span className="title2 text-primary-500"> 오류가 발생하였습니다.</span>
      <button
        onClick={() => reset()}
        className="body2 bg-primary-500 rounded-lg px-4 py-2 text-white"
      >
        다시 시도하기
      </button>
      <Link href={ROUTES.HOME} className="body2 underline opacity-60">
        메인화면으로 돌아가기
      </Link>
    </div>
  );
}
