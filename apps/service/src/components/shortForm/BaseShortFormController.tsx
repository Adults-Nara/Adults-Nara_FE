// components/video/BaseShortFormController.tsx
import { ReactNode } from 'react';
import { VideoInfoSection } from './VideoInfoSection';
import { ShortFormVideoData } from '@/types/video';

interface ControllerProps {
  data: ShortFormVideoData;
  isReady: boolean; // API 로딩 완료 여부
  actionSlot: ReactNode; // 좋아요, 싫어요 등
}

export function BaseShortFormController({
  data,
  isReady,
  actionSlot,
}: ControllerProps) {
  const stopPropagation = (
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent,
  ) => {
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
          className="pointer-events-auto absolute right-3 bottom-[18%]"
          onPointerDown={stopPropagation}
          onPointerUp={stopPropagation}
          onTouchStart={stopPropagation}
          onTouchMove={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={stopPropagation}
        >
          {actionSlot}
        </div>

        {/* 2. 하단 정보 및 시청 버튼 */}
        <VideoInfoSection
          title={data.title}
          uploader={{
            name: data.uploader.name,
            profileImg: data.uploader.profileImg ?? './defaultProfile.png',
          }}
          longformUrl={data.longformUrl}
          tags={data.tags}
          isAd={data.isAd}
        />
      </div>
    </div>
  );
}
