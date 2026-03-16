import ThumbnailSkeleton from './ThumbnailSkeleton';

const VideoVerticalCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg shadow-[0_0_2px_0px_rgba(0,0,0,0.25)]">
      <ThumbnailSkeleton type="long" />
      <div className="flex w-full animate-pulse flex-col gap-2 bg-white p-2">
        {/* 제목 스켈레톤 (한 줄) */}
        <div className="h-4 w-5/6 rounded bg-gray-200" />

        {/* 업로더 정보 */}
        <div className="h-3 w-1/3 rounded bg-gray-100" />

        {/* 조회수/날짜 정보 */}
        <div className="h-3 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  );
};
export default VideoVerticalCardSkeleton;
