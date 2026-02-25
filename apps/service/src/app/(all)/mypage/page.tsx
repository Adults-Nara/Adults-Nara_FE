import BookmarkList from './_components/BookmarkList';
import CategoryBoard from './_components/CategoryBoard';
import RecentHistory from './_components/RecentHistory';
import RewardSummary from './_components/RewardSummary';
import UserProfile from './_components/UserProfile';

const MyPage = () => {
  return (
    <div className="flex flex-col gap-5 px-5 py-5">
      <UserProfile />
      <CategoryBoard />
      <RewardSummary />
      <RecentHistory />
      <BookmarkList />
    </div>
  );
};

export default MyPage;
