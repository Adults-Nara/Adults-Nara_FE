'use client';
import { useMyuplusVerifyMutation } from '@/lib/tanstack/mutation/uplus.mutation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSheetStore } from '@/store/useSheetStore';
import { Button } from '@repo/ui';
import { useState } from 'react';

const UplusVerificationForm = () => {
  const [keyword, setKeyword] = useState('');
  const sheetClose = useSheetStore((state) => state.close);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { mutate, isPending } = useMyuplusVerifyMutation();

  const handleSubmit = () => {
    mutate(
      { phoneNumber: keyword },
      {
        onSuccess(data) {
          if (data.verified) {
            //TODO: 추후 토스트메시지
            console.log('회선등록성공', phoneNumber);
            sheetClose();
          } else {
            //TODO: 추후 토스트메시지
            console.log(data.message);
          }
        },
        onError(error) {
          //TODO: 추후 토스트메시지
          console.log('서버에러', error);
        },
      },
    );
  };

  return (
    // 구성 요소 예시
    <div className="flex w-full flex-col items-center gap-6 p-6">
      <div className="flex w-full flex-col gap-1">
        {/* 번호 입력 섹션 */}
        <label className="body2 w-full pl-1 text-gray-700">휴대폰 번호</label>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="tel"
          placeholder="- 없이 숫자만 입력해주세요."
          className="focus:border-primary-400 rounded-lg border border-gray-300 p-3 focus:outline-none"
        />
      </div>

      {/* 하단 확인 버튼 */}
      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? '등록중...' : '회선 등록하기'}
      </Button>
    </div>
  );
};

export default UplusVerificationForm;
