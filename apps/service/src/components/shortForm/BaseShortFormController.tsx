// components/video/BaseShortFormController.tsx
import { ReactNode } from 'react';
import { ShortFormVideoData } from '@/types/video';

interface ControllerProps {
  data: ShortFormVideoData;
  isReady: boolean; // API 로딩 완료 여부
  headerSlot?: ReactNode; // 로고, 건너뛰기 등
  actionSlot: ReactNode; // 좋아요, 싫어요 등
  infoSlot: ReactNode; // 업로더, 제목, 해당 영상 시청 버튼 등
}

export function BaseShortFormController({
  data,
  isReady,
  actionSlot,
  infoSlot,
}: ControllerProps) {
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    // isReady가 false면 아예 안 보이게 처리 (또는 opacity-0)
    <div
      className={`pointer-events-none absolute inset-0 z-50 flex flex-col text-white transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="relative flex-1">
        {/* 1. 우측 액션 버튼 */}
        <div
          className="pointer-events-auto absolute right-3 bottom-[20%]"
          onTouchStart={stopPropagation}
          onTouchMove={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={stopPropagation}
        >
          {actionSlot}
        </div>

        {/* 2. 하단 정보 및 시청 버튼 */}
        <div className="pointer-events-auto absolute right-0 bottom-0 left-0 p-4">
          <div className="flex flex-col gap-3">{infoSlot}</div>
        </div>
      </div>
    </div>
  );
}
