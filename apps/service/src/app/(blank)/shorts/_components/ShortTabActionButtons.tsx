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
import { useSheetStore } from '@/store/useSheetStore';
import CommentList from '@/components/comment/CommentList';

interface ShortTabActionButtonsProps {
  videoId: string;
}

export function ShortTabActionButtons({ videoId }: ShortTabActionButtonsProps) {
  const { data: interaction, isLoading: interactionLoading } =
    useInteraction(videoId);
  const { data: bookmark, isLoading: bookmarkLoading } =
    useBookmarkStatus(videoId);

  const { mutate: mutateLike } = useLikeVideo();
  const { mutate: mutateDislike } = useDislikeVideo();
  const { mutate: mutateBookmark } = useToggleBookmark();

  // 낙관적 업데이트를 위해, useState 사용
  const [liked, setLiked] = useState<boolean | null>();
  const [bookmarked, setBookmarked] = useState<boolean | null>();
  const isLogin = useIsLoggedIn();
  const sheetOpen = useSheetStore((state) => state.open);

  useEffect(() => {
    if (!interaction) return;
    switch (interaction.interactionType) {
      case 'LIKE':
        setLiked(true);
        break;
      case 'DISLIKE':
        setLiked(false);
        break;
    }
  }, [interaction]);

  useEffect(() => {
    if (bookmark?.isBookmarked !== undefined) {
      setBookmarked(bookmark.isBookmarked);
    }
  }, [bookmark]);

  // 좋아요, 싫어요 로직
  const handleLike = (changeTo: boolean) => {
    if (!isLogin) {
      // TODO : 로그인 모달 띄우기
      console.log('로그인이 필요합니다.');
      return;
    }
    if (changeTo === liked) {
      setLiked(null);
    } else {
      setLiked(changeTo);
    }
    // API 호출
    if (changeTo === true) {
      mutateLike(videoId);
    } else {
      mutateDislike(videoId);
    }
  };

  // 북마크 로직
  const handleBookmark = () => {
    if (!isLogin) {
      // TODO : 로그인 모달 띄우기
      console.log('로그인이 필요합니다.');
      return;
    }
    setBookmarked(!bookmarked);

    // API 호출
    mutateBookmark(videoId);
  };

  // 댓글 창 열기 로직
  const handleComment = () => {
    sheetOpen('댓글', <CommentList />, false);
  };
  if (interactionLoading || bookmarkLoading) return null;

  return (
    <div className="flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
      <button
        onClick={() => handleLike(true)}
        className="transition-transform active:scale-90"
      >
        {liked === true ? <LikeFill /> : <Like />}
      </button>

      <button
        onClick={() => handleLike(false)}
        className="transition-transform active:scale-90"
      >
        {liked === false ? <DislikeFill /> : <Dislike />}
      </button>

      <button
        onClick={handleBookmark}
        className="transition-transform active:scale-90"
      >
        {bookmarked ? <BookmarkFill /> : <Bookmark />}
      </button>

      <button
        className="flex flex-col items-center gap-1 border-none transition-transform active:scale-90"
        onClick={handleComment}
      >
        <Comment />
        {/* TODO: 댓글 개수 표시 */}
        <span className="body4">{10}</span>
      </button>
    </div>
  );
}
