'use client';

import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import useObserver from '@/hooks/useObserver';
import { useSearchVideos } from '@/lib/tanstack/query/search-ranking.query';
import { VideoSearchResponse } from '@/models/search.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function mapSearchToThumbanil(item: VideoSearchResponse): ThumbnailData {
  return {
    id: item.videoId.toString(),
    thumbnailSrc: item.thumbnailUrl,
    title: item.title,
    uploader: 'uploadr', //업로더이름 & 프로필사진 없음
    progress: 10, // 시청이력 없음
    duration: formatVideoTime(item.duration),
    views: item.viewCount,
    date: item.createdAt,
    type: 'long',
  };
}

const SearchList = () => {
  const searchParams = useSearchParams();
  const currentKeyword = searchParams.get('keyword') ?? '';
  const currentTag = searchParams.get('tag') ?? '';

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

      <div className="flex flex-col">
        {videos.map((data) => {
          return (
            //TODO: 추후 클릭이벤트 라우팅 수정해야됨
            <Link key={data.videoId} href={`/long/${data.videoId}`}>
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
