import {
  Bookmark,
  BookmarkFill,
  Comment,
  Dislike,
  DislikeFill,
  Like,
  LikeFill,
} from '@repo/ui';
import { useState } from 'react';
import { FocusWrapper } from './FocusWrapper';

export type ActionType = 'like' | 'dislike' | 'bookmark' | 'comment' | null;

interface OnboardingActionButtonsProps {
  focusedAction: ActionType;
  onMockAction: (action: ActionType) => void;
}

export function OnboardingActionButtons({
  focusedAction,
  onMockAction,
}: OnboardingActionButtonsProps) {
  const [mockedLike, setMockedLike] = useState<boolean | null>(null);
  const [mockBookmark, setMockBookmark] = useState(false);

  const handleAction = (type: ActionType) => {
    if (type === 'like' || type === 'dislike') {
      if (mockedLike === null) {
        setMockedLike(type === 'like');
      } else {
        setMockedLike((prev) =>
          prev === (type === 'like') ? null : type === 'like',
        );
      }
    } else if (type === 'bookmark') {
      setMockBookmark((prev) => !prev);
    }

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
    <FocusWrapper type={type} focusedAction={focusedAction}>
      <div className="justify-strat relative flex items-center">
        {focusedAction === type && (
          <div className="pointer-events-none absolute right-full mr-4 w-max animate-pulse rounded-lg bg-black/50 px-4 py-2 text-left">
            <span className="body1 leading-snug font-bold whitespace-pre-wrap text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {getTooltipText(type)}
            </span>
          </div>
        )}

        {/* 실제 버튼 내용 */}
        {children}
      </div>
    </FocusWrapper>
  );

  return (
    <div className="flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
      <ActionItem type="like">
        <button onClick={() => handleAction('like')} className="">
          {mockedLike ? <LikeFill /> : <Like />}
        </button>
      </ActionItem>

      <ActionItem type="dislike">
        <button onClick={() => handleAction('dislike')} className="">
          {mockedLike !== null && mockedLike === false ? (
            <DislikeFill />
          ) : (
            <Dislike />
          )}
        </button>
      </ActionItem>

      <ActionItem type="bookmark">
        <button onClick={() => handleAction('bookmark')} className="">
          {mockBookmark ? <BookmarkFill /> : <Bookmark />}
        </button>
      </ActionItem>

      <ActionItem type="comment">
        <button
          className="flex flex-col items-center gap-1 border-none"
          onClick={() => handleAction('comment')}
        >
          <Comment className="text-gray-700" />
        </button>
      </ActionItem>
    </div>
  );
}
