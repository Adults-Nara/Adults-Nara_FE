import RewardSummary from '@/app/(all)/mypage/_components/RewardSummary';
import PointHeader from './_components/PointHeader';
import PointHistory from './_components/PointHistory';

const PointPage = () => {
  return (
    <>
      <PointHeader />
      <div className="flex flex-col gap-5 p-5">
        <RewardSummary showDetailLink={false} />
        <PointHistory />
      </div>
    </>
  );
};

export default PointPage;
