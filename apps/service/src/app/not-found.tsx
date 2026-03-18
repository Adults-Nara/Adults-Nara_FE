import { ROUTES } from '@/constant/routes';
import { MapPinOff } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100">
      <MapPinOff size={40} />
      <span className="title2"> 올바르지 않은 경로입니다.</span>
      <Link href={ROUTES.HOME} className="body2 underline opacity-60">
        메인화면으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
