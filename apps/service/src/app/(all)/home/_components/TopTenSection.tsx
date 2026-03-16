'use client';
import { useRanking } from '@/lib/tanstack/query/search-ranking.query';
import useEmblaCarousel from 'embla-carousel-react';
import TopVideoItem from './TopVideoItem';
import { ROUTES } from '@/constant/routes';
import Link from 'next/link';
import { Button } from '@repo/ui';
import ThumbnailSkeleton from '@/components/skeleton/ThumbnailSkeleton';

const TopTenSection = () => {
  const { data, isError, isPending, refetch } = useRanking();

  const [videoRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-3">
        <span className="title1">지금 인기 있는 영상 상위10위</span>
        <span className="body3 text-gray-700">
          사용자들이 가장 많이 저장한 영상이에요
        </span>
      </div>
      {/* 로딩시 */}
      {isPending ? (
        <div className="flex flex-nowrap gap-4 overflow-hidden px-3 py-0.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="w-[90%] shrink-0">
              <ThumbnailSkeleton />
            </div>
          ))}
        </div>
      ) : /* 에러 */
      isError ? (
        <div className="border-primary-500 mx-3 flex flex-col items-center justify-center gap-5 rounded-lg border py-15">
          <span className="body2 text-primary-500">인기영상 에러</span>
          <Button size={'lg'} onClick={() => refetch()}>
            다시 시도하기
          </Button>
        </div>
      ) : // Empty
      data.length === 0 ? (
        <div className="mx-5 flex flex-col items-center justify-center rounded-lg border border-gray-400 py-15">
          <span className="body2 text-gray-600">인기 영상이 없습니다...</span>
        </div>
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
