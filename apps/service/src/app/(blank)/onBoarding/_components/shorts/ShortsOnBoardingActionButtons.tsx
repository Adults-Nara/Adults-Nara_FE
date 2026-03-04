import {
  Bookmark,
  BookmarkFill,
  Comment,
  Dislike,
  DislikeFill,
  Like,
  LikeFill,
} from '@repo/ui';
import { ShortsTourFocusWrapper } from './ShortsTourFocusWrapper';

export type ActionType = 'like' | 'dislike' | 'bookmark' | 'comment' | null;

interface OnboardingActionButtonsProps {
  focusedAction: ActionType;
  onMockAction: (action: ActionType) => void;
  isLiked?: boolean | null;
  isBookmarked?: boolean;
}

export function ShortsOnBoardingActionButtons({
  focusedAction,
  onMockAction,
  isLiked,
  isBookmarked,
}: OnboardingActionButtonsProps) {
  const handleAction = (type: ActionType) => {
    onMockAction(type);
  };

  const getTooltipText = (type: ActionType) => {
    switch (type) {
      case 'like':
        return '마음에 드는 영상엔\n좋아요를 눌러보세요!';
      case 'dislike':
        return '취향이 아니라면\n싫어요를 누를 수 있어요.';
      case 'bookmark':
        return '나중에 다시 보려면\n북마크에 저장하세요!';
      case 'comment':
        return '댓글을 남겨\n소통해보세요!';
      default:
        return '';
    }
  };

  const ActionItem = ({
    type,
    children,
  }: {
    type: ActionType;
    children: React.ReactNode;
  }) => (
    <ShortsTourFocusWrapper type={type} focusedAction={focusedAction}>
      <div className="justify-strat relative flex items-center">
        {focusedAction === type && (
          <div className="absolute right-full mr-4 w-max animate-pulse rounded-lg bg-black/50 px-4 py-2 text-left">
            <span className="body1 leading-snug font-bold whitespace-pre-wrap text-white">
              {getTooltipText(type)}
            </span>
          </div>
        )}

        {/* 실제 버튼 내용 */}
        {children}
      </div>
    </ShortsTourFocusWrapper>
  );

  return (
    <div className="flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
      <ActionItem type="like">
        <button aria-label="like" onClick={() => handleAction('like')}>
          {isLiked ? <LikeFill /> : <Like />}
        </button>
      </ActionItem>

      <ActionItem type="dislike">
        <button aria-label="dislike" onClick={() => handleAction('dislike')}>
          {isLiked !== null && isLiked === false ? (
            <DislikeFill />
          ) : (
            <Dislike />
          )}
        </button>
      </ActionItem>

      <ActionItem type="bookmark">
        <button aria-label="bookmark" onClick={() => handleAction('bookmark')}>
          {isBookmarked ? <BookmarkFill /> : <Bookmark />}
        </button>
      </ActionItem>

      <ActionItem type="comment">
        <button
          aria-label="comment"
          className="flex flex-col items-center gap-1 border-none"
          onClick={() => handleAction('comment')}
        >
          <Comment className="text-gray-700" />
        </button>
      </ActionItem>
    </div>
  );
}
