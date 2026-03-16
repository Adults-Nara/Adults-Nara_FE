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
  const interacted = (interaction?.interactionType as InteractionType) ?? null;
  const bookmarked = bookmark?.isBookmarked ?? false;

  // isLoading or isPending이면 버튼 비활성화 → debounce 효과
  const isInteractionBusy =
    interactionLoading || isLikePending || isDislikePending;
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

  return (
    <div className="flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
      <button
        onClick={() => handleInteracted(interacted)}
        disabled={isInteractionBusy}
        className="transition-transform active:scale-90 disabled:opacity-50"
      >
        {interacted === 'LIKE' ? <LikeFill /> : <Like />}
      </button>

      <button
        onClick={() => handleInteracted(interacted)}
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
        onClick={() => {}}
      >
        <Comment />
        <span className="body4">{commentNum}</span>
      </button>
    </div>
  );
}
