import { Button } from '@repo/ui';

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
  return (
    <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/50 to-transparent p-4">
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
        <span className="title3">{uploader.name}</span>
        {isAd && (
          <span className="rounded-sm bg-white/30 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
            AD
          </span>
        )}
      </div>

      {/* 영상 제목 및 시청 버튼 */}
      <p className="title3 mb-3">{title}</p>
      {tags && tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {longformUrl !== '' && (
        <Button
          size={null}
          className="title3 h-12.5 w-full bg-white/70 px-5 text-black"
        >
          해당영상 시청하기
        </Button>
      )}
    </div>
  );
}
