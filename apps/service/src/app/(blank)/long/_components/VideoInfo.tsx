'use client';

import { formatRelativeTime, formatViewCount } from '@/utils/format';
import {
  Bookmark,
  BookmarkFill,
  Button,
  Comment,
  Dislike,
  DislikeFill,
  Great,
  GreatFill,
  Like,
  LikeFill,
} from '@repo/ui';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { useToggleBookmark } from '@/lib/tanstack/mutation/bookmark.mutation';
import {
  useLikeVideo,
  useDislikeVideo,
  useSuperLikeVideo,
} from '@/lib/tanstack/mutation/interaction.mutation';
import { useSheetStore } from '@/store/useSheetStore';
import CommentList from '@/components/comment/CommentList';
import { InteractionType } from '@/types/interaction';
import { toast } from '@/lib/toast';
import { useLongPressTTS } from '@/hooks/useLongPressTTS';

interface VideoInfoProps {
  videoId: string;
  title: string;
  viewCount: number;
  uploadDate: string;
  uploader: { name: string; profileImg: string | null };
  comments: number;
  interaction: InteractionType;
  isBookmarked: boolean;
}

export function VideoInfo({
  videoId,
  title,
  viewCount,
  uploadDate,
  uploader,
  comments,
  interaction,
  isBookmarked,
}: VideoInfoProps) {
  const isLogin = useIsLoggedIn();
  const sheetOpen = useSheetStore((state) => state.open);
  const {
    mutate: toggleBookmarkMutate,
    isPending: isToggleBookmarkPending,
    isError: isToggleBookmarkError,
  } = useToggleBookmark();
  const {
    mutate: mutateLike,
    isPending: isLikePending,
    isError: isLikeError,
  } = useLikeVideo();
  const {
    mutate: mutateDislike,
    isPending: isDislikePending,
    isError: isDislikeError,
  } = useDislikeVideo();
  const {
    mutate: mutateSuperlike,
    isPending: isSuperlikePending,
    isError: isSuperlikeError,
  } = useSuperLikeVideo();

  const titleTTS = useLongPressTTS(title);
  const viewInfoTTS = useLongPressTTS(
    `조회수 ${formatViewCount(viewCount)}, ${formatRelativeTime(uploadDate)}`,
  );
  const interacted = interaction ?? null;
  const isInteractionBusy =
    isLikePending || isDislikePending || isSuperlikePending;
  const isBookmarkBusy = isToggleBookmarkPending;

  const handleInteraction = (type: InteractionType) => {
    if (isInteractionBusy) {
      toast.info('반응 처리 중입니다. 잠시후 다시 시도해주세요.');
      return;
    }
    if (!isLogin) {
      toast.info('로그인이 필요합니다.');
      return;
    }

    switch (type) {
      case 'SUPERLIKE':
        mutateSuperlike(videoId);
        break;
      case 'LIKE':
        mutateLike(videoId);
        break;
      case 'DISLIKE':
        mutateDislike(videoId);
        break;
      default:
        break;
    }
    if (isLikeError || isDislikeError || isSuperlikeError) {
      toast.error('반응 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const toggleBookmark = () => {
    if (isBookmarkBusy) {
      toast.info('북마크 처리 중입니다. 잠시후 다시 시도해주세요.');
      return;
    }
    if (!isLogin) {
      toast.info('로그인이 필요합니다.');
      return;
    }

    toggleBookmarkMutate(videoId);
    if (isToggleBookmarkError) {
      toast.error('북마크 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      {/* 제목 및 영상 정보*/}
      <div className="flex flex-col gap-1">
        <p className="title2 wrap-break-word whitespace-normal" {...titleTTS}>{title}</p>
        <div className="body4 flex flex-row text-gray-700" {...viewInfoTTS}>
          <p>조회수 {formatViewCount(viewCount)}</p>
          <p className="mx-1">·</p>
          <p>{formatRelativeTime(uploadDate)}</p>
        </div>
      </div>

      {/* 업로더 프로필 */}
      <div className="flex flex-row items-center gap-2">
        <div>
          <img
            src={uploader.profileImg ?? './defaultProfile.png'}
            alt="profile"
            className="h-8 w-8 rounded-full"
          />
        </div>
        <div className="title3">{uploader.name}</div>
      </div>

      {/* 반응 */}
      <div className="flex flex-row flex-wrap gap-1 text-gray-800">
        <Button
          variant="noneline"
          size="lg"
          onClick={() => handleInteraction('SUPERLIKE')}
        >
          {interaction === 'SUPERLIKE' ? <GreatFill /> : <Great />}
          최고예요
        </Button>
        <Button
          variant="noneline"
          size="lg"
          onClick={() => handleInteraction('LIKE')}
        >
          {interaction === 'LIKE' ? <LikeFill /> : <Like />}
          좋아요
        </Button>

        <Button
          variant="noneline"
          size="lg"
          onClick={() => handleInteraction('DISLIKE')}
        >
          {interaction === 'DISLIKE' ? <DislikeFill /> : <Dislike />}
          싫어요
        </Button>
        <Button variant="noneline" size="lg" onClick={() => toggleBookmark()}>
          {isBookmarked ? <BookmarkFill /> : <Bookmark />}
          찜하기
        </Button>
        <Button
          variant="noneline"
          size="lg"
          onClick={() =>
            sheetOpen('댓글', <CommentList videoId={videoId} />, false)
          }
        >
          <Comment />
          댓글 확인 · {comments}
        </Button>
      </div>
    </div>
  );
}
