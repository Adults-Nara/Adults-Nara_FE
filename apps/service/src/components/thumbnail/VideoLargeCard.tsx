import { ThumbnailData } from '@/types/video';
import Thumbnail from './Thumbnail';
import { formatRelativeTime, formatViewCount } from '@/utils/format';
import Image from 'next/image';

interface VideoLargeCardProps {
  data: ThumbnailData;
}

const VideoLargeCard = ({ data }: VideoLargeCardProps) => {
  return (
    <div className="flex w-full flex-col overflow-hidden">
      <Thumbnail
        type={data.type}
        src={data.thumbnailSrc}
        duration={data.duration}
        progress={data.progress}
      />
      <div className="flex w-full gap-3 bg-white px-2 py-3">
        {/* API연동시 이미지 태그추가 */}
        <div className="bg-primary-100 relative h-12.5 w-12.5 shrink-0 rounded-full">
          <Image
            src={`${data.ProfileImageUrl ?? '/defaultProfile.png'}`}
            alt={data.uploader}
            width={50}
            height={50}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="title3 line-clamp-2">{data.title}</span>
          <span className="body4 text-gray-700">
            {data.uploader} · 조회수 {formatViewCount(data.views)} ·{' '}
            {formatRelativeTime(data.date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoLargeCard;
