'use client';

import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { ROUTES } from '@/constant/routes';
import useObserver from '@/hooks/useObserver';
import { useSearchVideos } from '@/lib/tanstack/query/search-ranking.query';
import { VideoSearchResponse } from '@/models/search.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function mapSearchToThumbanil(item: VideoSearchResponse): ThumbnailData {
  return {
    id: item.videoId.toString(),
    thumbnailSrc: item.thumbnailSrc,
    title: item.title,
    uploader: item.uploader,
    ProfileImageUrl: item.uploaderProfileImageUrl,
    progress: item.progress,
    duration: formatVideoTime(item.duration),
    views: item.views,
    date: item.date,
    type: item.videoType === 'LONG' ? 'long' : 'short',
  };
}

const SearchList = () => {
  const searchParams = useSearchParams();
  const currentKeyword = searchParams.get('keyword') ?? '';
  const currentTag = searchParams.get('tag') ?? '';

  const [type, setType] = useState<undefined | 'SHORT' | 'LONG'>(undefined);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useSearchVideos({
    keyword: currentKeyword,
    tag: currentTag,
    videoType: type,
    size: 20,
  });
  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  //TODO: 로딩에러페이지 UI 추후 구현
  if (isPending) return <span>검색결과 로딩중..</span>;
  if (isError) return <span>검색결과 오류..</span>;

  const videos = data.pages.flatMap((page) => page.content) ?? [];

  if (videos.length === 0) return <span>검색결과가 없습니다.</span>;

  if (!currentKeyword && !currentTag) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <span className="body2 text-gray-500">검색어를 입력해주세요</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 pt-3">
      <span className="body2 px-5 text-gray-900">
        {currentKeyword
          ? `"${currentKeyword}" (으)로 검색된 결과`
          : `"${currentTag}" 주제가 포함된 결과`}
      </span>
      <div className="flex w-full rounded-full bg-gray-200 p-1">
        <button
          onClick={() => setType(undefined)}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition ${type === undefined ? 'bg-white shadow' : 'text-gray-700'}`}
        >
          전체
        </button>

        <button
          onClick={() => setType('SHORT')}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition ${type === 'SHORT' ? 'bg-white shadow' : 'text-gray-700'}`}
        >
          짧은 영상
        </button>

        <button
          onClick={() => setType('LONG')}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition ${type === 'LONG' ? 'bg-white shadow' : 'text-gray-700'}`}
        >
          긴 영상
        </button>
      </div>

      <div className="flex flex-col">
        {videos.map((data) => {
          return (
            <Link
              key={data.videoId}
              href={
                data.videoType === 'SHORT'
                  ? `${ROUTES.SHORTS}?v=${data.videoId}`
                  : `${ROUTES.LONG}?v=${data.videoId}`
              }
            >
              <VideoLargeCard data={mapSearchToThumbanil(data)} />
            </Link>
          );
        })}
      </div>
      <div ref={observerRef} />
    </div>
  );
};

export default SearchList;
