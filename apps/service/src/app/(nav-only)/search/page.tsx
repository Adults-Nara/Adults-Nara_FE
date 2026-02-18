import { Suspense } from 'react';
import InputHeader from './_components/InputHeader';
import SearchList from './_components/SearchList';

const page = () => {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div>검색창 불러오는 중...</div>}>
        <InputHeader />
        <SearchList />
      </Suspense>
    </div>
  );
};

export default page;
