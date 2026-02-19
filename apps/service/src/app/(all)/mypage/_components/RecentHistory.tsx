'use client';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';
import useEmblaCarousel from 'embla-carousel-react';

const RecentHistory = () => {
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <span className="title1">최근 시청 이력</span>
        <button className="body3 text-primary-500 cursor-pointer">
          모두보기{' >'}
        </button>
      </div>
      <div className="overflow-hidden px-0.5 py-0.5" ref={videoListRef}>
        <div className="flex gap-4">
          {/* 임시데이터 (API연동 필요) */}
          {MOCK_VIDEO_DATA.map((data, index) => {
            return (
              <div key={index} className="flex-[0_0_60%]">
                <VideoVerticalCard data={data} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentHistory;
