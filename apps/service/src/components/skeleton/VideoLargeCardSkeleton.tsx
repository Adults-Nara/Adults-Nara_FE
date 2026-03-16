import ThumbnailSkeleton from './ThumbnailSkeleton';

const VideoLargeCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden">
      <ThumbnailSkeleton type="long" />
      <div className="flex w-full animate-pulse gap-3 bg-white px-2 py-3">
        {/* 프로필 이미지 스켈레톤 */}
        <div className="h-12.5 w-12.5 shrink-0 rounded-full bg-gray-200" />

        <div className="flex w-full flex-col gap-2">
          {/* 제목 스켈레톤 (두 줄) */}
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />

          {/* 업로더/조회수 정보 스켈레톤 */}
          <div className="mt-1 h-3 w-2/3 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
};
export default VideoLargeCardSkeleton;
