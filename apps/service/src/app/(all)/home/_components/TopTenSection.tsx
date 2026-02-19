'use client';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';
import useEmblaCarousel from 'embla-carousel-react';

const TopTenSection = () => {
  const [videoRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-3">
        <span className="title1">오늘의 인기 영상 상위10위</span>
        <span className="body3 text-gray-700">
          지금 가장 많이 보고 있는 영상이에요
        </span>
      </div>
      <div className="overflow-hidden px-3 py-0.5" ref={videoRef}>
        <div className="flex gap-4">
          {/* 임시데이터 (API연동 필요) */}
          {MOCK_VIDEO_DATA.map((data, index) => {
            return (
              <div key={index} className="flex-[0_0_95%]">
                <VideoVerticalCard data={data} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopTenSection;
