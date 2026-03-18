import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategorySection from './_components/CategorySection';
import RecommendedSection from './_components/RecommendedSection';
import TopTenSection from './_components/TopTenSection';

export default function Home() {
  return (
    <div className="flex flex-col gap-5 py-5">
      <TopTenSection />
      <CategorySection />
      <RecommendedSection />

      <ScrollToTopButton />
    </div>
  );
}
