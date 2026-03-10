import ShortsTab from './_components/ShortsTab';
import { ShortsHeader } from './_components/ShortsHeader';

export default async function ShortsPage({
  searchParams,
}: {
  searchParams: Promise<{ index?: number; listType?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
      <ShortsHeader />

      {/* Vertical scroll container */}
      <ShortsTab params={params} />
    </div>
  );
}
