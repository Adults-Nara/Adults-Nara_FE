import { Suspense } from 'react';
import InputHeader from './_components/InputHeader';
import SearchList from './_components/SearchList';

const SearchPage = () => {
  return (
    <div className="flex flex-col">
      <Suspense>
        <InputHeader />
        <SearchList />
      </Suspense>
    </div>
  );
};

export default SearchPage;
