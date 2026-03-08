import ShortsTab from './_components/ShortsTab';
import { ShortsHeader } from './_components/ShortsHeader';

export default function ShortsPage() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
      <ShortsHeader />

      {/* Vertical scroll container */}
      <ShortsTab />
    </div>
  );
}
