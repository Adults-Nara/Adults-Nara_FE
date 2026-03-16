'use client';

import useEmblaCarousel from 'embla-carousel-react';
import BookmarkItem from './BookmarkItem';
import { useSheetStore } from '@/store/useSheetStore';
import SheetBookmarkList from './SheetBookmarkList';
import { useBookmarkSummary } from '@/lib/tanstack/query/bookmark.query';
import { CircleX, Inbox } from 'lucide-react';
import VideoVerticalCardSkeleton from '@/components/skeleton/VideoVerticalCardSkeleton';

const BookmarkList = () => {
  const { open } = useSheetStore();
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const { data, isError, isPending, refetch } = useBookmarkSummary();

  if (isPending)
    return (
      <div className="flex flex-nowrap gap-4 overflow-hidden py-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-60 shrink-0">
            <VideoVerticalCardSkeleton />
          </div>
        ))}
      </div>
    );
  if (isError)
    return (
      <div className="border-primary-500 flex w-full flex-col items-center justify-center gap-3 rounded-lg border py-10">
        <CircleX size={35} className="text-primary-500" />
        <span className="body2 text-primary-500">
          찜한 영상을 불러오지 못했습니다.
        </span>
        <button
          onClick={() => refetch()}
          className="body3 underline opacity-60"
        >
          다시 시도하기
        </button>
      </div>
    );

  const hasShortForm = data.shortForm.totalCount > 0;
  const hasLongForm = data.longForm.totalCount > 0;

  return (
    <div className="flex flex-col gap-4">
      <span className="title1">찜한 영상</span>

      <div className="overflow-hidden px-0.5 py-0.5" ref={videoListRef}>
        <div className="flex gap-4">
          {!hasShortForm ? null : (
            <button
              type="button"
              className="flex-[0_0_70%] cursor-pointer text-left"
              onClick={() =>
                open(
                  '짧은영상 찜한 목록',
                  <SheetBookmarkList videoType="SHORT" />,
                )
              }
            >
              <BookmarkItem data={data.shortForm} type="short" />
            </button>
          )}
          {!hasLongForm ? null : (
            <button
              type="button"
              className="flex-[0_0_70%] cursor-pointer text-left"
              onClick={() =>
                open('긴영상 찜한 목록', <SheetBookmarkList videoType="LONG" />)
              }
            >
              <BookmarkItem data={data.longForm} type="long" />
            </button>
          )}
          {!hasShortForm && !hasLongForm && (
            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-400 py-10 text-gray-600">
              <Inbox size={35} />
              <span className="body2">찜한 영상이 없습니다.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkList;
