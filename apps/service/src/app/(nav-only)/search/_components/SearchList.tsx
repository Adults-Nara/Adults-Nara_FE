'use client';

import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';
import { useSearchParams } from 'next/navigation';

const SearchList = () => {
  const searchParams = useSearchParams();
  const currentKeyword = searchParams.get('keyword') ?? '';
  return (
    <div className="flex flex-col gap-3 pt-3">
      <span className="body2 px-5 text-gray-900">{`"${currentKeyword}" (으)로 검색된 결과`}</span>

      <div className="flex flex-col">
        {MOCK_VIDEO_DATA.map((data, index) => {
          return (
            <div key={index}>
              <VideoLargeCard data={data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchList;
