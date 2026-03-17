import ThumbnailSkeleton from './ThumbnailSkeleton';

const VideoHorizontalCardSkeleton = () => {
  return (
    <div className="flex w-full overflow-hidden rounded-lg">
      {/* 썸네일 영역 (가로형이므로 보통 고정 폭을 가지거나 비율을 유지함) */}
      <div className="w-1/2 shrink-0">
        <ThumbnailSkeleton type="long" />
      </div>

      <div className="flex w-full animate-pulse flex-col gap-2 px-2 py-2">
        {/* 제목 스켈레톤 */}
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />

        {/* 업로더 및 정보 */}
        <div className="mt-1 h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  );
};

export default VideoHorizontalCardSkeleton;
