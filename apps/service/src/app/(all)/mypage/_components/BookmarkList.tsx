'use client';

import useEmblaCarousel from 'embla-carousel-react';
import BookmarkItem from './BookmarkItem';
import { useSheetStore } from '@/store/useSheetStore';
import SheetBookmarkList from './SheetBookmarkList';
import { useBookmarkSummary } from '@/lib/tanstack/query/bookmark.query';

const BookmarkList = () => {
  const { open } = useSheetStore();
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const { data, isError, isPending } = useBookmarkSummary();

  //TODO: 추후 로딩에러페이지 구현
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러</div>;

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
          {!hasShortForm && !hasLongForm && <span>찜한 영상이 없습니다.</span>}
        </div>
      </div>
    </div>
  );
};

export default BookmarkList;
