import Image from 'next/image';

interface ThumbnailProps {
  src: string;
  duration?: string;
  alt?: string;
  type?: 'long' | 'short';
  progress?: number;
}
const Thumbnail = ({
  src,
  duration,
  alt = 'thumbnail',
  type = 'long',
  progress,
}: ThumbnailProps) => {
  const ratioClass = type === 'short' ? 'aspect-9/16' : 'aspect-video';
  return (
    <div className={`relative w-full overflow-hidden ${ratioClass}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {progress !== undefined && progress > 0 && (
        <div
          className="absolute bottom-0 h-0.75 bg-red-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      )}
      {type === 'long' && (
        <span className="body4 absolute right-2 bottom-2 rounded-sm bg-black/80 px-1 text-white">
          {duration}
        </span>
      )}
    </div>
  );
};

export default Thumbnail;
