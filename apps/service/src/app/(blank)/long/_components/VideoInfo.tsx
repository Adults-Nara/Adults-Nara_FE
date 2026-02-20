import { DetailedVideoData } from '@/types/video';
import { Bookmark, Chip, Comment, Dislike, Like } from '@repo/ui';
import { IconChip } from './IconChip';

export function VideoInfo({ data }: { data: DetailedVideoData }) {
  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      {/* 제목 및 영상 정보*/}
      <div className="flex flex-col gap-1">
        <p className="title2 wrap-break-word whitespace-normal">{data.title}</p>
        <div className="body4 flex flex-row text-gray-700">
          <p>조회수 {data.viewCount}회</p>
          <p className="mx-1">·</p>
          <p>{data.uploadDate}</p>
        </div>
      </div>

      {/* 업로더 프로필 */}
      <div className="flex flex-row items-center gap-2">
        <div>
          {data.uploader.profileImg ? (
            <img
              src={data.uploader.profileImg}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="bg-primary-100 h-8 w-8 rounded-full"></div>
          )}
        </div>
        <div className="title3">{data.uploader.name}</div>
      </div>

      {/* 반응 */}
      <div className="flex flex-row flex-wrap gap-1">
        <IconChip icon={Like} label="좋아요" iconWidth={20} iconHeight={20} />
        <IconChip
          icon={Dislike}
          label="싫어요"
          iconWidth={20}
          iconHeight={20}
        />
        <IconChip
          icon={Bookmark}
          label="찜하기"
          iconWidth={20}
          iconHeight={20}
        />
        <IconChip
          icon={Comment}
          label={`댓글 확인 · ${data.comments}`}
          iconWidth={20}
          iconHeight={20}
        />
      </div>
    </div>
  );
}
