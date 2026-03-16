import {
  LikeFill,
  Like,
  DislikeFill,
  Dislike,
  BookmarkFill,
  Bookmark,
  Comment,
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
  const { data: interaction, isLoading: interactionLoading } =
    useInteraction(videoId);
  const { data: bookmark, isLoading: bookmarkLoading } =
    useBookmarkStatus(videoId);

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

  // isLoading or isPending이면 버튼 비활성화 → debounce 효과
  const isInteractionBusy =
    interactionLoading ||
    isLikePending ||
    isDislikePending ||
    isSuperlikePending;
  const isBookmarkBusy = bookmarkLoading || isBookmarkPending;

  const handleInteracted = (type: InteractionType) => {
    if (!isLoggedIn || isInteractionBusy) return;

    switch (type) {
      case 'LIKE':
        mutateLike(videoId);
        break;
      case 'DISLIKE':
        mutateDislike(videoId);
        break;
      case 'SUPERLIKE':
        mutateSuperlike(videoId);
        break;
    }
  };

  const handleBookmark = () => {
    if (isAd || !isLoggedIn || isBookmarkBusy) return;
    mutateBookmark(videoId);
  };

  // 댓글 창 열기 로직
  const handleComment = () => {
    sheetOpen('댓글', <CommentList videoId={videoId} />, false);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
      <button
        onClick={() => handleInteracted('LIKE')}
        disabled={isInteractionBusy}
        className="transition-transform active:scale-90 disabled:opacity-50"
      >
        {interacted === 'LIKE' ? <LikeFill /> : <Like />}
      </button>

      <button
        onClick={() => handleInteracted('DISLIKE')}
        disabled={isInteractionBusy}
        className="transition-transform active:scale-90 disabled:opacity-50"
      >
        {interacted === 'DISLIKE' ? <DislikeFill /> : <Dislike />}
      </button>

      <button
        onClick={handleBookmark}
        disabled={isBookmarkBusy}
        className="transition-transform active:scale-90 disabled:opacity-50"
      >
        {bookmarked ? <BookmarkFill /> : <Bookmark />}
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
