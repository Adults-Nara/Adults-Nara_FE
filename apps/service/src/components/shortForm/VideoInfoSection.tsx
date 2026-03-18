'use client';

import { ROUTES } from '@/constant/routes';
import { findLabelByValue } from '@/utils/findLabelByValue';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useLongPressTTS } from '@/hooks/useLongPressTTS';

function TagItem({ tag }: { tag: string }) {
  const label = `# ${findLabelByValue(tag)}`;
  const tts = useLongPressTTS(label);
  return (
    <span
      className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white"
      {...tts}
    >
      {label}
    </span>
  );
}
interface VideoInfoSectionProps {
  title: string;
  uploader: {
    name: string;
    profileImg?: string;
  };
  longformUrl: string; // 영상의 긴 형식 URL (예: 유튜브 링크)
  tags?: string[];
  isAd?: boolean;
}

export function VideoInfoSection({
  title,
  uploader,
  longformUrl,
  tags,
  isAd,
}: VideoInfoSectionProps) {
  const router = useRouter();
  const titleTTS = useLongPressTTS(title);
  const uploaderTTS = useLongPressTTS(uploader.name);
  const adTTS = useLongPressTTS('광고 영상입니다');
  return (
    <div
      className={`pointer-events-auto absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/50 to-transparent p-4 ${isAd && 'pb-14'} `}
    >
      {/* 업로더 정보 */}
      <div className="mb-2 flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
          {uploader.profileImg ? (
            <img
              src={uploader.profileImg}
              className="h-full w-full object-cover"
              alt=""
            />
          ) : (
            <div className="bg-primary-100 h-full w-full rounded-full" />
          )}
        </div>
        <span className="title3" {...uploaderTTS}>{uploader.name}</span>
        {isAd && (
          <span
            className="rounded-sm bg-white/30 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase"
            {...adTTS}
          >
            AD
          </span>
        )}
      </div>

      {/* 영상 제목 및 시청 버튼 */}
      <p className="title3 mb-3" {...titleTTS}>{title}</p>
      {tags && tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <TagItem key={tag} tag={tag} />
          ))}
        </div>
      )}
      {longformUrl !== '' && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-full"
        >
          <Button
            size={null}
            className="title3 h-12.5 w-full bg-white/70 px-5 text-black"
            onClick={() => {
              const url = new URL(longformUrl);
              const videoId = url.searchParams.get('v');
              router.push(`${ROUTES.LONG}?v=${videoId}`, { scroll: false });
            }}
          >
            해당영상 시청하기
          </Button>
        </div>
      )}
    </div>
  );
}
