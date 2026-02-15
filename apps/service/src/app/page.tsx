import { Button, Logo, SearchIcon } from '@repo/ui';

export default function Home() {
  return (
    <>
      <h1>서비스</h1>
      <Logo className="h-50 w-50" />

      <div className="title1">title1</div>
      <div className="title2">title2</div>
      <div className="title3">title3</div>
      <div className="body1">body1</div>
      <div className="body2">body2</div>
      <div className="body3 text-primary-700">body3</div>
      <div className="body4 text-gray-500">body4</div>

      <Button className="w-fit">
        <SearchIcon className="" /> 아하
      </Button>
      <Button variant={'outline'} size={'lg'}>
        <SearchIcon /> 아하
      </Button>
      <Button variant={'outline'} size={'sm'} className="w-fit border-none">
        <SearchIcon className="h-3 w-3" /> 아하
      </Button>
    </>
  );
}
