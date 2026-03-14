'use client';

import { ROUTES } from '@/constant/routes';
import { useMyPointBalance } from '@/lib/tanstack/query/point.query';
import { useMyuplusVerify } from '@/lib/tanstack/query/uplus.query';
import { useAuthStore } from '@/store/useAuthStore';
import { useSheetStore } from '@/store/useSheetStore';
import { Button } from '@repo/ui';
import { CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';
import UplusVerificationForm from './UplusVerificationForm';

interface RewardSummaryProps {
  showDetailLink?: boolean;
}

const RewardSummary = ({ showDetailLink = true }: RewardSummaryProps) => {
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const sheetOpen = useSheetStore((state) => state.open);
  const {
    data: myVerify,
    isPending: verifyPending,
    isError: verifyError,
  } = useMyuplusVerify({ phoneNumber: phoneNumber || '0' });
  const {
    data: myPoint,
    isPending: pointPending,
    isError: pointError,
  } = useMyPointBalance();

  if (verifyPending || pointPending) return <span>로딩중...</span>;
  if (verifyError || pointError) return <span>에러...</span>;

  return (
    <div className="bg-primary-900 flex w-full flex-col gap-4 rounded-lg p-4">
      <div className="flex w-full items-center justify-between">
        <span className="title2 text-white">이번 달 혜택</span>

        {showDetailLink && (
          <Link className="body3 cursor-pointer text-white" href={ROUTES.POINT}>
            자세히보기{' >'}
          </Link>
        )}
      </div>

      <div className="body2 text-white">
        <span className="title2 text-primary-600 text-4xl">
          {myPoint.currentBalance}
        </span>
        {myVerify.verified
          ? '원 혜택을 받아요.'
          : '원 받을 수 있는 혜택이 있어요.'}
      </div>

      <div className="flex flex-col gap-2 border-t border-white/20 pt-3">
        {myVerify.verified ? (
          <>
            <div className="flex items-center gap-2 text-white">
              <Smartphone size={20} />
              <span className="body2 w-14 text-gray-400">회선번호</span>
              <span className="body2">
                {myVerify.subscription.maskedPhoneNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <CreditCard size={20} />
              <span className="body2 w-14 text-gray-400">요금제</span>
              <span className="body2">{`${myVerify.subscription.planDisplayName} · ${myVerify.subscription.monthlyFee}`}</span>
              <span className="body2"></span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="body2 text-white">
              혜택을 받으려면 LG U+ 회선 인증이 필요해요.
            </span>
            <Button
              onClick={() =>
                sheetOpen('LG U+ 회선등록', <UplusVerificationForm />)
              }
              size={'lg'}
              className="w-40"
            >
              회선 등록하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardSummary;
