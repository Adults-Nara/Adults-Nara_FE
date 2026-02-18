import InputHeader from './_components/InputHeader';
import SearchList from './_components/SearchList';

const page = () => {
  return (
    <div className="flex flex-col">
      <InputHeader />
      <SearchList />
    </div>
  );
};

export default page;
