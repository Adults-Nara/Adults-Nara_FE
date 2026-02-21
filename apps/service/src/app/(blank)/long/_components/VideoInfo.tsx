import RecommendedSection from '@/app/(all)/home/_components/RecommendedSection';
import { DetailedVideoData } from '@/types/video';
import { formatRelativeTime, formatViewCount } from '@/utils/format';
import { Bookmark, Button, Comment, Dislike, Like } from '@repo/ui';

export function VideoInfo({ data }: { data: DetailedVideoData }) {
  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      {/* 제목 및 영상 정보*/}
      <div className="flex flex-col gap-1">
        <p className="title2 wrap-break-word whitespace-normal">{data.title}</p>
        <div className="body4 flex flex-row text-gray-700">
          <p>조회수 {formatViewCount(data.viewCount)}</p>
          <p className="mx-1">·</p>
          <p>{formatRelativeTime(data.uploadDate)}</p>
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
      <div className="flex flex-row flex-wrap gap-1 text-gray-800">
        <Button variant="noneline" size="lg">
          <Like />
          좋아요
        </Button>

        <Button variant="noneline" size="lg">
          <Dislike />
          싫어요
        </Button>
        <Button variant="noneline" size="lg">
          <Bookmark />
          찜하기
        </Button>
        <Button variant="noneline" size="lg">
          <Comment />
          댓글 확인 · {data.comments}
        </Button>
      </div>

      {/* 추천 영상 */}
      <RecommendedSection />
    </div>
  );
}
