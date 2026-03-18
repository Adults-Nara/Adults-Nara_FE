import { Suspense } from 'react';
import InputHeader from './_components/InputHeader';
import SearchList from './_components/SearchList';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const SearchPage = () => {
  return (
    <div className="flex flex-col">
      <Suspense>
        <InputHeader />
        <SearchList />
      </Suspense>

      <ScrollToTopButton />
    </div>
  );
};

export default SearchPage;
