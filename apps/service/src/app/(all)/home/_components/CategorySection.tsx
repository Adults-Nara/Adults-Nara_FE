'use client';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';
import { Chip } from '@repo/ui';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

// 임시 데이터 (나중에 API 연동)
const categories = [
  '건강',
  '요리',
  '애완동물',
  '음식',
  '뉴스',
  '드라마',
  '교양',
  '원예',
];

const CategorySection = () => {
  const [categoriRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <span className="title1 pl-3">주제별 인기 영상</span>
      <div className="overflow-hidden px-3" ref={categoriRef}>
        <div className="flex gap-2.5">
          {categories.map((cat, index) => (
            <Chip key={index}> {cat}</Chip>
          ))}
        </div>
      </div>

      <div className="overflow-hidden px-3 py-0.5" ref={videoListRef}>
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

export default CategorySection;
