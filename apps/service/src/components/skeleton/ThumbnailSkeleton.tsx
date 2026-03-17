interface ThumbnailSkeletonProps {
  type?: 'long' | 'short';
  fillContainer?: boolean;
}

const ThumbnailSkeleton = ({
  type = 'long',
  fillContainer = false,
}: ThumbnailSkeletonProps) => {
  const isShort = type === 'short';

  // 원본 컴포넌트의 containerClass 로직과 동일하게 유지
  const containerClass = fillContainer ? 'h-full' : 'aspect-video';

  return (
    <div
      className={`relative w-full animate-pulse overflow-hidden bg-gray-200 ${containerClass} ${
        isShort ? 'flex items-center justify-center' : ''
      }`}
    >
      {/* Shorts 타입일 경우 내부 9:16 박스 재현 */}
      {isShort && <div className="relative aspect-9/16 h-full bg-gray-300" />}

      {/* 우측 하단 재생 시간(Duration) 위치의 스켈레톤 */}
      {!isShort && (
        <div className="absolute right-2 bottom-2 h-4 w-10 rounded-sm bg-gray-300" />
      )}

      {/* 하단 재생바(Progress) 위치의 스켈레톤 (선택 사항) */}
      {!isShort && (
        <div className="absolute bottom-0 h-0.75 w-full bg-gray-300/50" />
      )}
    </div>
  );
};

export default ThumbnailSkeleton;
