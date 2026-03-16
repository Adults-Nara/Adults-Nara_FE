import {
  Bookmark,
  BookmarkFill,
  Comment,
  Dislike,
  DislikeFill,
  Great,
  GreatFill,
  Like,
  LikeFill,
} from '@repo/ui';
import { ShortsTourFocusWrapper } from './ShortsTourFocusWrapper';
import { InteractionType } from '@/types/interaction';

export type ActionType =
  | 'SUPERLIKE'
  | 'LIKE'
  | 'DISLIKE'
  | 'BOOKMARK'
  | 'COMMENT'
  | null;

interface OnboardingActionButtonsProps {
  focusedAction: ActionType;
  onMockAction: (action: ActionType) => void;
  interaction?: InteractionType;
  isBookmarked?: boolean;
}

export function ShortsOnBoardingActionButtons({
  focusedAction,
  onMockAction,
  interaction,
  isBookmarked,
}: OnboardingActionButtonsProps) {
  const handleAction = (type: ActionType) => {
    onMockAction(type);
  };

  const getTooltipText = (type: ActionType) => {
    switch (type) {
      case 'SUPERLIKE':
        return '마음에 드는 영상엔\n최고예요를 눌러보세요!';
      case 'LIKE':
        return '마음에 드는 영상엔\n좋아요를 눌러보세요!';
      case 'DISLIKE':
        return '취향이 아니라면\n싫어요를 누를 수 있어요.';
      case 'BOOKMARK':
        return '나중에 다시 보려면\n찜하기로 저장해보세요!';
      case 'COMMENT':
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
    <div className="flex flex-col items-center gap-7 text-[32px] drop-shadow-sm">
      <ActionItem type="SUPERLIKE">
        <button
          className="flex flex-col items-center gap-1 text-[36px] transition-transform active:scale-90"
          aria-label="superlike"
          onClick={() => handleAction('SUPERLIKE')}
        >
          {interaction === 'SUPERLIKE' ? <GreatFill /> : <Great />}
          <span className="body4">최고예요</span>
        </button>
      </ActionItem>
      <ActionItem type="LIKE">
        <button
          className="flex flex-col items-center gap-1 text-[32px] transition-transform active:scale-90"
          aria-label="like"
          onClick={() => handleAction('LIKE')}
        >
          {interaction === 'LIKE' ? <LikeFill /> : <Like />}
          <span className="body4">좋아요</span>
        </button>
      </ActionItem>

      <ActionItem type="DISLIKE">
        <button
          className="flex flex-col items-center gap-1 text-[32px] transition-transform active:scale-90"
          aria-label="dislike"
          onClick={() => handleAction('DISLIKE')}
        >
          {interaction === 'DISLIKE' ? <DislikeFill /> : <Dislike />}
          <span className="body4">싫어요</span>
        </button>
      </ActionItem>

      <ActionItem type="BOOKMARK">
        <button
          className="flex flex-col items-center gap-1 text-[32px] transition-transform active:scale-90"
          aria-label="bookmark"
          onClick={() => handleAction('BOOKMARK')}
        >
          {isBookmarked ? <BookmarkFill /> : <Bookmark />}
          <span className="body4">찜하기</span>
        </button>
      </ActionItem>

      <ActionItem type="COMMENT">
        <button
          aria-label="comment"
          className="flex flex-col items-center gap-1 border-none text-gray-700"
          onClick={() => handleAction('COMMENT')}
        >
          <Comment className="" />
          <span className="body4">댓글</span>
        </button>
      </ActionItem>
    </div>
  );
}
