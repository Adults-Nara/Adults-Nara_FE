'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';
import BookmarkItem from './BookmarkItem';

const BookmarkList = () => {
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });
  return (
    <div className="flex flex-col gap-4">
      <span className="title1">찜한 영상</span>

      <div className="overflow-hidden py-0.5" ref={videoListRef}>
        <div className="flex gap-4">
          <div className="flex-[0_0_60%]">
            <BookmarkItem data={MOCK_VIDEO_DATA} type="long" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkList;
