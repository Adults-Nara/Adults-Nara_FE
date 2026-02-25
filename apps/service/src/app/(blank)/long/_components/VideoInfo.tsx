'use client';

import { formatRelativeTime, formatViewCount } from '@/utils/format';
import {
  Bookmark,
  BookmarkFill,
  Button,
  Comment,
  Dislike,
  DislikeFill,
  Like,
  LikeFill,
} from '@repo/ui';
import { useState } from 'react';

interface VideoInfoProps {
  title: string;
  viewCount: number;
  uploadDate: string;
  uploader: { name: string; profileImg: string | null };
  comments: number;
  isLiked?: boolean | null;
  isBookmarked: boolean;
}

export function VideoInfo({
  title,
  viewCount,
  uploadDate,
  uploader,
  comments,
  isLiked,
  isBookmarked,
}: VideoInfoProps) {
  const [isLikedState, setIsLiked] = useState(isLiked);
  const [isBookmarkedState, setIsBookmarked] = useState(isBookmarked);

  const handleLike = (changeTo: boolean) => {
    if (changeTo == isLikedState) {
      setIsLiked(null);
    } else {
      setIsLiked(changeTo);
    }
  };
  const toggleBookmark = () => {
    // TODO : api
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      {/* 제목 및 영상 정보*/}
      <div className="flex flex-col gap-1">
        <p className="title2 wrap-break-word whitespace-normal">{title}</p>
        <div className="body4 flex flex-row text-gray-700">
          <p>조회수 {formatViewCount(viewCount)}</p>
          <p className="mx-1">·</p>
          <p>{formatRelativeTime(uploadDate)}</p>
        </div>
      </div>

      {/* 업로더 프로필 */}
      <div className="flex flex-row items-center gap-2">
        <div>
          {uploader.profileImg ? (
            <img
              src={uploader.profileImg}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="bg-primary-100 h-8 w-8 rounded-full"></div>
          )}
        </div>
        <div className="title3">{uploader.name}</div>
      </div>

      {/* 반응 */}
      <div className="flex flex-row flex-wrap gap-1 text-gray-800">
        <Button variant="noneline" size="lg" onClick={() => handleLike(true)}>
          {isLikedState ? <LikeFill /> : <Like />}
          좋아요
        </Button>

        <Button variant="noneline" size="lg" onClick={() => handleLike(false)}>
          {isLikedState === false ? <DislikeFill /> : <Dislike />}
          싫어요
        </Button>
        <Button variant="noneline" size="lg" onClick={() => toggleBookmark()}>
          {isBookmarkedState ? <BookmarkFill /> : <Bookmark />}
          찜하기
        </Button>
        <Button variant="noneline" size="lg">
          <Comment />
          댓글 확인 · {comments}
        </Button>
      </div>
    </div>
  );
}
