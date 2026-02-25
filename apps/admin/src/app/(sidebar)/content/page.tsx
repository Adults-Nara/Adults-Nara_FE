import { ContentListContainer } from '@components/content';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ContentListPage = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  return (
    <div className="flex flex-1 bg-gray-100 px-9 pt-5">
      <ContentListContainer currentPage={currentPage} />
    </div>
  );
};

export default ContentListPage;
