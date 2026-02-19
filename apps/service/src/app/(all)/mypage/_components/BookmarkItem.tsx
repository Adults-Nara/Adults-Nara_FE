import Thumbnail from '@/components/thumbnail/Thumbnail';
import { ThumbnailData } from '@/types/video';

interface BookmarkItemProps {
  data: ThumbnailData[];
  type: 'long' | 'short';
}

const BookmarkItem = ({ data, type }: BookmarkItemProps) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg shadow-[0_0_2px_0px_rgba(0,0,0,0.25)]">
      <div className="grid aspect-video grid-cols-2 grid-rows-2">
        {data.slice(0, 4).map((video, index) => {
          return <Thumbnail key={index} type={type} src={video.thumbnailSrc} />;
        })}
      </div>
      <div className="flex w-full flex-col gap-1 bg-white p-2">
        <span className="title3 line-clamp-2">
          {type === 'long' ? '긴 영상' : '짧은 영상'} 재생목록
        </span>
        <span className="body4 text-gray-700">영상 {data.length}개</span>
      </div>
    </div>
  );
};

export default BookmarkItem;
