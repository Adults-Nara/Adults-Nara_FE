'use client';
import { ROUTES } from '@/constant/routes';
import { LeftArrow } from '@repo/ui';
import { useRouter } from 'next/navigation';

export function PageHeader() {
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.HOME);
    }
  };

  return (
    <div className="absolute top-0 left-0 z-11 p-3">
      <LeftArrow
        className="h-4.5 w-5 text-white/70"
        onClick={(e) => {
          handleBack();
        }}
      />
    </div>
  );
}
