'use client';

import { ROUTES } from '@/constant/routes';
import { Link, TriangleAlert } from 'lucide-react';

const Error = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100">
      <TriangleAlert size={40} className="text-primary-500" />
      <span className="title2 text-primary-500"> 오류가 발생하였습니다.</span>
      <Link href={ROUTES.HOME} className="body2 underline opacity-60">
        메인화면으로 돌아가기
      </Link>
    </div>
  );
};

export default Error;
