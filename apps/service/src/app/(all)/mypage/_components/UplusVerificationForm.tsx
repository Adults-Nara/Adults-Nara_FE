'use client';
import { useMyuplusVerifyMutation } from '@/lib/tanstack/mutation/uplus.mutation';
import { useSheetStore } from '@/store/useSheetStore';
import { Button } from '@repo/ui';
import { useState } from 'react';

const UplusVerificationForm = () => {
  const [keyword, setKeyword] = useState('');
  const sheetClose = useSheetStore((state) => state.close);
  const { mutate, isPending } = useMyuplusVerifyMutation();

  const handleSubmit = () => {
    mutate(
      { phoneNumber: keyword },
      {
        onSuccess(data) {
          if (data.verified) {
            //TODO: 추후 토스트메시지
            console.log('회선연결성공');
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
        <label
          htmlFor="phone-input"
          className="body2 w-full pl-1 text-gray-700"
        >
          휴대폰 번호
        </label>
        <input
          id="phone-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          placeholder="- 없이 숫자만 입력해주세요."
          className="focus:border-primary-400 rounded-lg border border-gray-300 p-3 focus:outline-none"
        />
      </div>

      {/* 하단 확인 버튼 */}
      <Button
        onClick={handleSubmit}
        disabled={isPending || keyword.length < 10}
      >
        {isPending ? '등록중...' : '회선 등록하기'}
      </Button>
    </div>
  );
};

export default UplusVerificationForm;
