import { CommentItemResponse } from '@/models/comment.model';
import { formatRelativeTime } from '@/utils/format';
import { CircleStar, Pin } from 'lucide-react';
import Image from 'next/image';

interface CommentItemProps {
  comment: CommentItemResponse;
  isMy?: boolean;
}
const CommentItem = ({ comment, isMy = false }: CommentItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-300 py-2.5">
      {isMy ? (
        <span className="body3 flex items-center gap-1 px-7">
          <CircleStar className="text-primary-600" size={20} /> 내가 작성한 댓글
        </span>
      ) : null}
      <div className={`flex gap-2`}>
        <div className="relative h-7.5 w-7.5 shrink-0 overflow-hidden rounded-full">
          <Image
            src={comment.profileImageUrl ?? `/defaultProfile.png`}
            alt={comment.nickname}
            width={30}
            height={30}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="body3 text-gray-700">{`${comment.nickname} · ${formatRelativeTime(comment.createdAt)}`}</span>
          <span className="body2">{comment.text}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
