import { UsersListContainer } from '@components/user';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const UserListPage = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  return (
    <div className="flex flex-1 bg-gray-100 px-9 pt-5">
      <UsersListContainer type="user" currentPage={currentPage} />
    </div>
  );
};

export default UserListPage;
