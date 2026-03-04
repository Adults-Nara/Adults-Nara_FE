import { ShortFormVideoData } from '@/types/video';
import {
  LikeFill,
  Like,
  DislikeFill,
  Dislike,
  BookmarkFill,
  Bookmark,
  Comment,
} from '@repo/ui';
import { useState } from 'react';

interface ShortTabActionButtonsProps {
  videoData: ShortFormVideoData;
}

export function ShortTabActionButtons({
  videoData,
}: ShortTabActionButtonsProps) {
  const [liked, setLiked] = useState<boolean | null>(videoData.isLiked ?? null);
  const [bookmarked, setBookmarked] = useState<boolean>(videoData.isBookmarked);

  // 좋아요, 싫어요 로직
  const handleLike = (changeTo: boolean) => {
    if (changeTo === liked) {
      setLiked(null);
    } else {
      setLiked(changeTo);
    }
    // TODO: 여기에 실제 API 호출 로직 추가 (ex. 낙관적 업데이트 후 서버 전송)
  };

  // 북마크 로직
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: 북마크 API 호출 로직 추가
  };

  // 댓글 창 열기 로직
  const handleComment = () => {
    // TODO: 실제 서비스의 댓글 바텀시트(Bottom Sheet)나 모달을 여는 로직 추가
    console.log('댓글 창 열기:', videoData.id);
  };

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
        <span className="body4">{videoData.comments}</span>
      </button>
    </div>
  );
}
