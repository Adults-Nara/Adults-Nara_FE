import { UsersListContainer } from '@components/user';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const UserListPage = async ({ searchParams }: PageProps) => {
  const { page, keyword } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentKeyword = String(keyword ?? '');
  return (
    <div className="flex flex-1 bg-gray-100 px-9 pt-5">
      <UsersListContainer
        type="VIEWER"
        currentKeyword={currentKeyword}
        currentPage={currentPage}
      />
    </div>
  );
};

export default UserListPage;
