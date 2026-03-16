import {
  LikeFill,
  Like,
  DislikeFill,
  Dislike,
  BookmarkFill,
  Bookmark,
  Comment,
} from '@repo/ui';
import { useEffect, useState } from 'react';
import { useInteraction } from '@/lib/tanstack/query/interaction.query';
import {
  useDislikeVideo,
  useLikeVideo,
} from '@/lib/tanstack/mutation/interaction.mutation';
import { useBookmarkStatus } from '@/lib/tanstack/query/bookmark.query';
import { useToggleBookmark } from '@/lib/tanstack/mutation/bookmark.mutation';
import { useIsLoggedIn } from '@/store/useAuthStore';

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
  const { mutate: mutateBookmark, isPending: isBookmarkPending } =
    useToggleBookmark();

  const isLoggedIn = useIsLoggedIn();

  const liked =
    interaction?.interactionType === 'LIKE'
      ? true
      : interaction?.interactionType === 'DISLIKE'
        ? false
        : null;
  const bookmarked = bookmark?.isBookmarked ?? false;

  // isLoading or isPending이면 버튼 비활성화 → debounce 효과
  const isInteractionBusy =
    interactionLoading || isLikePending || isDislikePending;
  const isBookmarkBusy = bookmarkLoading || isBookmarkPending;

  const handleLike = (changeTo: boolean) => {
    if (!isLoggedIn || isInteractionBusy) return;

    if (changeTo === true) {
      mutateLike(videoId);
    } else {
      mutateDislike(videoId);
    }
  };

  const handleBookmark = () => {
    if (isAd || !isLoggedIn || isBookmarkBusy) return;
    mutateBookmark(videoId);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
      <button
        onClick={() => handleLike(true)}
        disabled={isInteractionBusy}
        className="transition-transform active:scale-90 disabled:opacity-50"
      >
        {liked === true ? <LikeFill /> : <Like />}
      </button>

      <button
        onClick={() => handleLike(false)}
        disabled={isInteractionBusy}
        className="transition-transform active:scale-90 disabled:opacity-50"
      >
        {liked === false ? <DislikeFill /> : <Dislike />}
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
