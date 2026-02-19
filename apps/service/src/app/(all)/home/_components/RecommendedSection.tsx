import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';

const RecommendedSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <span className="title1 pl-3">추천영상</span>

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

export default RecommendedSection;
