import {
  LikeFill,
  Like,
  DislikeFill,
  Dislike,
  BookmarkFill,
  Bookmark,
  Comment,
  GreatFill,
  Great,
} from '@repo/ui';
import { useInteraction } from '@/lib/tanstack/query/interaction.query';
import {
  useDislikeVideo,
  useLikeVideo,
  useSuperLikeVideo,
} from '@/lib/tanstack/mutation/interaction.mutation';
import { useBookmarkStatus } from '@/lib/tanstack/query/bookmark.query';
import { useToggleBookmark } from '@/lib/tanstack/mutation/bookmark.mutation';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { InteractionType } from '@/types/interaction';
import { useSheetStore } from '@/store/useSheetStore';
import CommentList from '@/components/comment/CommentList';
import { toast } from '@/lib/toast';

interface ShortTabActionButtonsProps {
  videoId: string;
  isAd: boolean;
  commentNum: number;
}

export function ShortTabActionButtons({
  videoId,
  isAd,
  commentNum,
}: ShortTabActionButtonsProps) {
  const {
    data: interaction,
    isLoading: interactionLoading,
    isError: isInteractionError,
  } = useInteraction(videoId);
  const {
    data: bookmark,
    isLoading: bookmarkLoading,
    isError: isBookmarkError,
  } = useBookmarkStatus(videoId);

  const { mutate: mutateLike, isPending: isLikePending } = useLikeVideo();
  const { mutate: mutateDislike, isPending: isDislikePending } =
    useDislikeVideo();
  const { mutate: mutateSuperlike, isPending: isSuperlikePending } =
    useSuperLikeVideo();
  const { mutate: mutateBookmark, isPending: isBookmarkPending } =
    useToggleBookmark();

  const isLoggedIn = useIsLoggedIn();
  const interacted = interaction?.interactionType ?? null;
  const bookmarked = bookmark?.isBookmarked ?? false;
  const sheetOpen = useSheetStore((state) => state.open);

  if (isInteractionError || isBookmarkError) {
    toast.error('반응 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }

  // isLoading or isPending이면 버튼 비활성화. debounce 효과
  const isInteractionBusy =
    interactionLoading ||
    isLikePending ||
    isDislikePending ||
    isSuperlikePending;
  const isBookmarkBusy = bookmarkLoading || isBookmarkPending;

  const handleInteracted = (type: InteractionType) => {
    if (!isLoggedIn) {
      toast.info('로그인이 필요합니다. 로그인 후 이용해주세요.');
      return;
    }
    if (isInteractionBusy) {
      toast.info('반응 처리 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    switch (type) {
      case 'LIKE':
        mutateLike(videoId, {
          onError: () => {
            toast.error(
              '좋아요 처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
          },
        });

        break;
      case 'DISLIKE':
        mutateDislike(videoId, {
          onError: () => {
            toast.error(
              '싫어요 처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
          },
        });

        break;
      case 'SUPERLIKE':
        mutateSuperlike(videoId, {
          onError: () => {
            toast.error(
              '최고예요 처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
          },
        });

        break;
    }
  };

  const handleBookmark = () => {
    if (isAd) {
      toast.info('광고 영상은 찜하기를 할 수 없습니다.');
      return;
    }
    if (!isLoggedIn) {
      toast.info('로그인이 필요합니다. 로그인 후 이용해주세요.');
      return;
    }
    if (isBookmarkBusy) {
      toast.info('찜하기 처리 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    mutateBookmark(videoId, {
      onError: () => {
        toast.error('찜하기 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
      },
    });
  };

  // 댓글 창 열기 로직
  const handleComment = () => {
    sheetOpen('댓글', <CommentList videoId={videoId} />, false);
  };

  return (
    <div className="flex flex-col items-center gap-7 text-[32px] drop-shadow-sm">
      <button
        onClick={() => handleInteracted('SUPERLIKE')}
        disabled={isInteractionBusy}
        className="flex flex-col items-center gap-1 text-[36px] transition-transform active:scale-90 disabled:opacity-50"
      >
        {interacted === 'SUPERLIKE' ? <GreatFill /> : <Great />}
        <span className="body4">최고예요</span>
      </button>
      <button
        onClick={() => handleInteracted('LIKE')}
        disabled={isInteractionBusy}
        className="flex flex-col items-center gap-1 transition-transform active:scale-90 disabled:opacity-50"
      >
        {interacted === 'LIKE' ? <LikeFill /> : <Like />}
        <span className="body4">좋아요</span>
      </button>

      <button
        onClick={() => handleInteracted('DISLIKE')}
        disabled={isInteractionBusy}
        className="flex flex-col items-center gap-1 transition-transform active:scale-90 disabled:opacity-50"
      >
        {interacted === 'DISLIKE' ? <DislikeFill /> : <Dislike />}
        <span className="body4">싫어요</span>
      </button>

      <button
        onClick={handleBookmark}
        disabled={isBookmarkBusy || isAd}
        className="flex flex-col items-center gap-1 transition-transform active:scale-90 disabled:opacity-50"
      >
        {bookmarked ? <BookmarkFill /> : <Bookmark />}
        <span className="body4">찜하기</span>
      </button>

      <button
        className="flex flex-col items-center gap-1 border-none transition-transform active:scale-90"
        onClick={handleComment}
      >
        <Comment />
        <span className="body4">{commentNum}</span>
      </button>
    </div>
  );
}
