import { ThumbnailData } from '@/types/video';
import Thumbnail from './Thumbnail';
import { formatRelativeTime, formatViewCount } from '@/utils/format';

interface VideoHorizontalCardProps {
  data: ThumbnailData;
}

const VideoHorizontalCard = ({ data }: VideoHorizontalCardProps) => {
  return (
    <div className="flex w-full overflow-hidden rounded-lg">
      <Thumbnail
        type={data.type}
        src={data.thumbnailSrc}
        duration={data.duration}
        progress={data.progress}
      />
      <div className="flex w-full flex-col gap-1 px-2 py-1">
        <span className="title3 line-clamp-2">{data.title}</span>
        <span className="body4 text-gray-700">{data.uploader}</span>
        <span className="body4 text-gray-700">
          조회수 {formatViewCount(data.views)} · {formatRelativeTime(data.date)}
        </span>
      </div>
    </div>
  );
};

export default VideoHorizontalCard;
