import { ThumbnailData } from '@/types/video';
import Thumbnail from './Thumbnail';
import { formatRelativeTime, formatViewCount } from '@/utils/format';

interface VideoVerticalCardProps {
  data: ThumbnailData;
}

const VideoVerticalCard = ({ data }: VideoVerticalCardProps) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg shadow-[0_0_2px_0px_rgba(0,0,0,0.25)]">
      <Thumbnail
        type={data.type}
        src={data.thumbnailSrc}
        duration={data.duration}
        progress={data.progress}
      />
      <div className="flex w-full flex-col gap-1 bg-white p-2">
        <span className="title3 line-clamp-1">{data.title}</span>
        <span className="body4 text-gray-700">{data.uploader}</span>
        <span className="body4 text-gray-700">
          조회수 {formatViewCount(data.views)} · {formatRelativeTime(data.date)}
        </span>
      </div>
    </div>
  );
};

export default VideoVerticalCard;
