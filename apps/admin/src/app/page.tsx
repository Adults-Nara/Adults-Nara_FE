import { cn, Logo } from '@repo/ui';

export default function Home() {
  return (
    <>
      <h1>관리자</h1>
      <Logo className="h-50 w-50" />

      <div className="title1">title1</div>
      <div className="title2">title2</div>
      <div className="title3">title3</div>
      <div className="body1">body1</div>
      <div className="body2">body2</div>
      <div className="body3 text-primary-700">body3</div>
      <div className="body4 text-gray-500">body4</div>
    </>
  );
}
