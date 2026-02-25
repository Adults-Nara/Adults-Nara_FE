import Image from 'next/image';

interface ThumbnailProps {
  src: string;
  duration?: string;
  alt?: string;
  type?: 'long' | 'short';
  progress?: number;
  fillContainer?: boolean; //북마크 그리드썸네일 용
}
const Thumbnail = ({
  src,
  duration,
  alt = 'thumbnail',
  type = 'long',
  progress,
  fillContainer = false,
}: ThumbnailProps) => {
  const containerClass = fillContainer ? 'h-full' : 'aspect-video';
  const isShort = type === 'short';
  return (
    <div
      className={`relative w-full overflow-hidden ${containerClass} ${
        isShort ? 'flex items-center justify-center bg-black' : ''
      }`}
    >
      {isShort ? (
        <div className="relative aspect-9/16 h-full">
          <Image src={src} alt={alt} fill className="object-cover" />
        </div>
      ) : (
        <Image src={src} alt={alt} fill className="object-cover" />
      )}
      {progress !== undefined && !isShort && progress > 0 && (
        <div
          className="absolute bottom-0 h-0.75 bg-red-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      )}
      {type === 'long' && duration && (
        <span className="body4 absolute right-2 bottom-2 rounded-sm bg-black/80 px-1 text-white">
          {duration}
        </span>
      )}
    </div>
  );
};

export default Thumbnail;
