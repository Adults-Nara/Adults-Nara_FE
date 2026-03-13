'use client';

import { formatRelativeTime, formatViewCount } from '@/utils/format';
import {
  Bookmark,
  BookmarkFill,
  Button,
  Comment,
  Dislike,
  DislikeFill,
  Like,
  LikeFill,
} from '@repo/ui';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { useToggleBookmark } from '@/lib/tanstack/mutation/bookmark.mutation';
import {
  useLikeVideo,
  useDislikeVideo,
} from '@/lib/tanstack/mutation/interaction.mutation';

interface VideoInfoProps {
  videoId: number;
  title: string;
  viewCount: number;
  uploadDate: string;
  uploader: { name: string; profileImg: string | null };
  comments: number;
  isLiked?: boolean | null;
  isBookmarked: boolean;
}

export function VideoInfo({
  videoId,
  title,
  viewCount,
  uploadDate,
  uploader,
  comments,
  isLiked,
  isBookmarked,
}: VideoInfoProps) {
  const isLogin = useIsLoggedIn();
  const { mutate: toggleBookmarkMutate, isPending: isToggleBookmarkPending } =
    useToggleBookmark();
  const { mutate: likeVideoMutate, isPending: isLikeVideoPending } =
    useLikeVideo();
  const { mutate: dislikeVideoMutate, isPending: isDislikeVideoPending } =
    useDislikeVideo();

  const handleLike = (changeTo: boolean) => {
    if (isLikeVideoPending || isDislikeVideoPending) {
      // TODO : 사용자에게 피드백 제공 (예: 토스트 메시지)
      console.log('반응 처리 중입니다. 잠시만 기다려주세요.');
      return;
    }
    if (!isLogin) {
      // TODO : 사용자에게 피드백 제공 (예: 토스트 메시지)
      console.log('로그인이 필요합니다.');
      return;
    }

    if (changeTo) {
      likeVideoMutate(videoId);
    } else {
      dislikeVideoMutate(videoId);
    }
  };

  const toggleBookmark = () => {
    if (!isLogin) {
      console.log('로그인이 필요합니다.');
      return;
    }
    toggleBookmarkMutate(videoId);
  };

  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      {/* 제목 및 영상 정보*/}
      <div className="flex flex-col gap-1">
        <p className="title2 wrap-break-word whitespace-normal">{title}</p>
        <div className="body4 flex flex-row text-gray-700">
          <p>조회수 {formatViewCount(viewCount)}</p>
          <p className="mx-1">·</p>
          <p>{formatRelativeTime(uploadDate)}</p>
        </div>
      </div>

      {/* 업로더 프로필 */}
      <div className="flex flex-row items-center gap-2">
        <div>
          {uploader.profileImg ? (
            <img
              src={uploader.profileImg}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="bg-primary-100 h-8 w-8 rounded-full"></div>
          )}
        </div>
        <div className="title3">{uploader.name}</div>
      </div>

      {/* 반응 */}
      <div className="flex flex-row flex-wrap gap-1 text-gray-800">
        <Button variant="noneline" size="lg" onClick={() => handleLike(true)}>
          {isLiked === true ? <LikeFill /> : <Like />}
          좋아요
        </Button>

        <Button variant="noneline" size="lg" onClick={() => handleLike(false)}>
          {isLiked === false ? <DislikeFill /> : <Dislike />}
          싫어요
        </Button>
        <Button variant="noneline" size="lg" onClick={() => toggleBookmark()}>
          {isBookmarked ? <BookmarkFill /> : <Bookmark />}
          찜하기
        </Button>
        <Button variant="noneline" size="lg">
          <Comment />
          댓글 확인 · {comments}
        </Button>
      </div>
    </div>
  );
}
