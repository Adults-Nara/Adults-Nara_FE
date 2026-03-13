'use client';
import { useRanking } from '@/lib/tanstack/query/search-ranking.query';
import useEmblaCarousel from 'embla-carousel-react';
import TopVideoItem from './TopVideoItem';
import { ROUTES } from '@/constant/routes';
import Link from 'next/link';

const TopTenSection = () => {
  const { data, isError, isPending } = useRanking();

  const [videoRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  //TODO: 로딩에러 페이지 추후 제작
  if (isPending) return <span>랭킹 로딩중...</span>;
  if (isError) return <span>랭킹 에러...</span>;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-3">
        <span className="title1">지금 인기 있는 영상 상위10위</span>
        <span className="body3 text-gray-700">
          사용자들이 가장 많이 저장한 영상이에요
        </span>
      </div>
      {data.length === 0 ? (
        <span>상위 10위 영상이 없습니다.</span>
      ) : (
        <div className="overflow-hidden px-3 py-0.5" ref={videoRef}>
          <div className="flex gap-4">
            {data.map((data) => {
              return (
                <Link
                  key={data.videoId}
                  href={`${ROUTES.LONG}?v=${data.videoId}`}
                  className="flex-[0_0_90%]"
                >
                  <TopVideoItem
                    rank={data.rank}
                    thumbnail={data.thumbnailSrc}
                    title={data.title}
                    score={data.rankingScore}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopTenSection;
