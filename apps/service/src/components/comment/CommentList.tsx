'use client';

import useObserver from '@/hooks/useObserver';
import { useComments } from '@/lib/tanstack/query/comment.query';
import { Button, Input, LeftArrow, Send } from '@repo/ui';
import CommentItem from './CommentItem';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  useCreateComment,
  useDeleteComment,
  useEditComment,
} from '@/lib/tanstack/mutation/comment.mutation';
import { useIsLoggedIn } from '@/store/useAuthStore';
import { MessageSquareX } from 'lucide-react';

const CommentList = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const isLoggin = useIsLoggedIn();
  const [write, setWrite] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');

  const { mutate: createMutate } = useCreateComment();
  const { mutate: editMutate } = useEditComment();
  const { mutate: deleteMutate } = useDeleteComment();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useComments(videoId ?? '');

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const myComment = data?.pages[0]?.myComment;
  const isEmpty = comments.length === 0 && !myComment;

  const handleCreate = () => {
    if (!isLoggin) {
      //TODO: 추후토스트메시지
      console.log('로그인사용자 아님');
      return;
    }
    if (!videoId) return;
    createMutate(
      { videoId, data: { text: write } },
      {
        onSuccess: () => {
          setWrite('');
          //TODO: 토스트 변경
          console.log('댓글작성 완료');
        },
        onError: (error) => {
          console.log('댓글작성 오류', error.message);
        },
      },
    );
  };

  const handleEditStart = () => {
    if (!myComment) return;
    setEditText(myComment.text);
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
  };

  const handleEditSave = () => {
    if (!videoId || !myComment) return;

    editMutate(
      { commentId: myComment.commentId, data: { text: editText } },
      {
        onSuccess: () => {
          setEditText('');
          //TODO: 토스트 변경
          console.log('댓글수정 완료');
          setEditMode(false);
        },
        onError: (error) => {
          console.log('댓글수정 오류', error.message);
        },
      },
    );
  };

  //TODO:추후 모달로 확인 한번 받기
  const handleDelete = () => {
    if (!myComment) return;

    deleteMutate(myComment.commentId, {
      onSuccess: () => {
        //TODO: 토스트 변경
        console.log('댓글삭제 완료');
      },
      onError: (error) => {
        console.log('댓글삭제 오류', error.message);
      },
    });
  };

  //TODO: 추후 로딩에러페이지 구현
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러</div>;

  return (
    <div className="it flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
            <MessageSquareX size={35} />
            <span>아직 댓글이 없습니다.</span>
          </div>
        ) : (
          <>
            {myComment && <CommentItem comment={myComment} isMy={true} />}
            {comments.map((comment) => (
              <CommentItem key={comment.commentId} comment={comment} />
            ))}

            <div ref={observerRef} className="h-1" />
          </>
        )}
      </div>

      <div className="flex gap-3 border-t border-gray-300 px-4 py-3">
        {myComment ? (
          editMode ? ( // 수정 모드
            <>
              <button onClick={handleEditCancel}>
                <LeftArrow className="h-8 w-8" />
              </button>
              <Input
                value={editText}
                placeholder="댓글 수정하기"
                onChange={(e) => setEditText(e.target.value)}
                className="rounded-xl"
                showClear
                onClear={() => setEditText('')}
              />

              <button
                type="button"
                onClick={handleEditSave}
                className={`cursor-pointer text-gray-900 hover:text-gray-700 ${editText.length === 0 && 'opacity-30 hover:text-gray-900'}`}
                disabled={editText.length === 0}
              >
                <Send className="h-8 w-8" />
              </button>
            </>
          ) : (
            //기본 상태
            <div className="flex w-full justify-center gap-2.5">
              <Button
                variant={'outline'}
                size={'lg'}
                className="w-50"
                onClick={handleEditStart}
              >
                댓글 수정
              </Button>

              <Button size={'lg'} className="w-50" onClick={handleDelete}>
                댓글 삭제
              </Button>
            </div>
          )
        ) : (
          <>
            <Input
              placeholder="댓글 작성하기"
              value={write}
              onChange={(e) => setWrite(e.target.value)}
              className="rounded-xl"
              showClear
              onClear={() => setWrite('')}
            />
            <button
              type="button"
              onClick={handleCreate}
              className={`cursor-pointer text-gray-900 hover:text-gray-700 ${write.length === 0 && 'opacity-30 hover:text-gray-900'}`}
              disabled={write.length === 0}
            >
              <Send className="h-8 w-8" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentList;
