import { Suspense } from 'react';
import InputHeader from './_components/InputHeader';
import SearchList from './_components/SearchList';

const SearchPage = () => {
  return (
    <div className="flex flex-col">
      {/* TODO: 로딩화면 추후 추가 */}
      <Suspense fallback={<div>검색창 불러오는 중...</div>}>
        <InputHeader />
        <SearchList />
      </Suspense>
    </div>
  );
};

export default SearchPage;
