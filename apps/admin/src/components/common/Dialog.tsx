'use client';
import { useState, useEffect } from 'react';
import { useDialogStore } from '@/store/useDialogStore';
import { Button, Close } from '@repo/ui';

// 선택 옵션 배열
const options = [
  { label: '7일 정지', value: 'SUSPENDED_7' },
  { label: '15일 정지', value: 'SUSPENDED_15' },
  { label: '30일 정지', value: 'SUSPENDED_30' },
  { label: '영구 비활성화', value: 'DEACTIVATED' },
] as const;

const labelMap: Record<string, string> = {
  user: '사용자',
  uploader: '업로더',
  content: '콘텐츠',
} as const;

export function Dialog() {
  const { isOpen, UserType, DialogType, data, closeDialog } = useDialogStore();
  const [reasonText, setReasonText] = useState('');
  // 정지 기간 상태 추가
  const [period, setPeriod] = useState<
    'SUSPENDED_7' | 'SUSPENDED_15' | 'SUSPENDED_30' | 'DEACTIVATED'
  >('SUSPENDED_7');

  // 다이얼로그가 열릴 때마다 입력값 초기화
  useEffect(() => {
    if (isOpen) {
      setReasonText('');
      setPeriod('SUSPENDED_7');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetLabel = UserType ? labelMap[UserType] : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeDialog}
    >
      {/* 모달 컨테이너 */}
      <div
        className="relative flex w-full max-w-110 flex-col gap-4 rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 우상단 닫기 X 버튼 */}
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
          onClick={closeDialog}
        >
          <Close />
        </button>

        {/* --- 1. 비활성화 실행 다이얼로그 (deactivate) --- */}
        {DialogType === 'deactivate' && (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="title3 text-black">{targetLabel} 비활성화</h2>
              <p className="body3 text-gray-700 italic">
                {data.name ? `"${data.name}"` : '선택된'} {targetLabel}를
                비활성화하시겠습니까?
              </p>
            </div>
            {UserType !== 'content' && (
              <>
                {/* 정지 기간 선택 (칩 스타일) */}
                <div className="flex flex-col gap-2">
                  <label className="body3 text-gray-800">처리 기간</label>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPeriod(opt.value)}
                        className={`body4 rounded-md border px-3 py-2 transition-all ${
                          period === opt.value
                            ? 'border-primary-500 bg-primary-100 text-primary-600 font-bold'
                            : 'border-gray-400 bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="body3 text-gray-800">비활성화 사유</label>
                  <textarea
                    className="body3 focus:border-primary-400 focus:ring-primary-400 min-h-20 w-full resize-none rounded-lg border border-gray-300 p-3 transition-all outline-none placeholder:text-gray-500 focus:ring-1"
                    placeholder="비활성화 사유를 입력하세요..."
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button
                className="body3 w-15 bg-white"
                size={'lg'}
                variant={'outline'}
                onClick={closeDialog}
              >
                취소
              </Button>
              <Button
                size={'lg'}
                className="body3 w-25"
                onClick={() => {
                  data.onConfirm?.(reasonText, period);
                  closeDialog();
                }}
              >
                비활성화
              </Button>
            </div>
          </>
        )}

        {/* --- 2. 비활성화 사유 보기 다이얼로그 (reason) --- */}
        {DialogType === 'reason' && (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="title3 text-black">비활성화 사유</h2>
              <p className="body3 text-gray-700 italic">
                {data.name ? `"${data.name}"` : '선택된'} {targetLabel}의
                비활성화 사유입니다.
              </p>
            </div>

            <div className="body3 min-h-20 rounded-lg bg-gray-200 p-4 leading-relaxed text-gray-900">
              {data.reason || '등록된 사유가 없습니다.'}
            </div>

            <div className="flex justify-end">
              <Button
                className="body3 w-20 bg-white"
                size={'lg'}
                variant={'outline'}
                onClick={closeDialog}
              >
                닫기
              </Button>
            </div>
          </>
        )}

        {/* --- 3. 활성화 실행 다이얼로그 (activate) --- */}
        {DialogType === 'activate' && (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="title3 text-black">{targetLabel} 활성화</h2>
              <p className="body3 text-gray-700 italic">
                {data.name ? `"${data.name}"` : '선택된'} {targetLabel}를
                활성화하시겠습니까?
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="body3 w-15 bg-white"
                size={'lg'}
                variant={'outline'}
                onClick={closeDialog}
              >
                취소
              </Button>
              <Button
                size={'lg'}
                className="body3 w-25"
                onClick={() => {
                  data.onConfirm?.();
                  closeDialog();
                }}
              >
                활성화
              </Button>
            </div>
          </>
        )}
        {/* --- 4. 삭제확인 다이얼로그 (delete) --- */}
        {DialogType === 'delete' && (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="title3 text-black">{targetLabel} 삭제 확인</h2>
              <p className="body3 text-gray-700 italic">
                {data.name ? `"${data.name}"` : '선택된'} {targetLabel}를
                삭제하시겠습니까? 삭제시 복구가 불가능합니다.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="body3 w-15 bg-white"
                size={'lg'}
                variant={'outline'}
                onClick={closeDialog}
              >
                취소
              </Button>
              <Button
                size={'lg'}
                className="body3 w-25"
                onClick={() => {
                  data.onConfirm?.();
                  closeDialog();
                }}
              >
                삭제
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
