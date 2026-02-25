import VideoHorizontalCard from '@/components/thumbnail/VideoHorizontalCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';

//api 연동시 숏폼,롱폼,최근시청이력 props 추가해서 api호출하기?
const SheetPlayList = () => {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {MOCK_VIDEO_DATA.map((video, index) => {
        return <VideoHorizontalCard key={index} data={video} />;
      })}
    </div>
  );
};

export default SheetPlayList;
