'use client';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import useEmblaCarousel from 'embla-carousel-react';
import { useSheetStore } from '@/store/useSheetStore';
import { useRecentWatchHistory } from '@/lib/tanstack/query/watch-history.query';
import { WatchHistoryItemResponse } from '@/models/watch-history.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import { useRouter } from 'next/navigation';
import SheetRecentHistory from './SheetRecentHistory';

export function mapWatchHistoryToThumbnail(
  item: WatchHistoryItemResponse,
): ThumbnailData {
  return {
    id: item.videoId,
    thumbnailSrc: item.thumbnailUrl,
    title: item.title,
    uploader: item.uploaderName,
    duration: formatVideoTime(item.duration),
    progress: item.watchProgressPercent,
    views: item.viewCount,
    date: item.uploadedAt,
    type: item.videoType === 'LONG' ? 'long' : 'short',
  };
}

const RecentHistory = () => {
  const { open } = useSheetStore();
  const router = useRouter();
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const { data, isError, isPending } = useRecentWatchHistory();

  //TODO: 로딩에러페이지 UI 추후 구현
  if (isPending) return <span>시청이력 로딩중..</span>;
  if (isError) return <span>시청이력 오류..</span>;

  const items = data?.pages[0].items;
  const noneItems = items.length === 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <span className="title1">최근 시청 이력</span>
        {!noneItems && (
          <button
            className="body3 text-primary-500 cursor-pointer"
            onClick={() => open('최근 시청 이력', <SheetRecentHistory />)}
          >
            모두보기{' >'}
          </button>
        )}
      </div>
      <div className="overflow-hidden px-0.5 py-0.5" ref={videoListRef}>
        <div className="flex gap-4">
          {noneItems ? (
            <span>시청이력이 없습니다.</span>
          ) : (
            items.map((data) => {
              const mapped = mapWatchHistoryToThumbnail(data);
              return (
                //TODO: 추후 클릭이벤트 라우팅 수정해야됨
                <div
                  key={data.videoId}
                  className="flex-[0_0_60%]"
                  onClick={() => router.push(`/long/${data.videoId}`)}
                >
                  <VideoVerticalCard data={mapped} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentHistory;
