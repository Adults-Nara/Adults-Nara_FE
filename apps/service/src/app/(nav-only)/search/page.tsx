import { Suspense } from 'react';
import InputHeader from './_components/InputHeader';
import SearchList from './_components/SearchList';
import { Spinner } from '@repo/ui';

const SearchPage = () => {
  return (
    <div className="flex flex-col">
      {/* TODO: 로딩화면 추후 추가 */}
      <Suspense fallback={<Spinner size={50} />}>
        <InputHeader />
        <SearchList />
      </Suspense>
    </div>
  );
};

export default SearchPage;
