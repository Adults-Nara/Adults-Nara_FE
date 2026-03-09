import {
  AdminContentsList,
  UploaderContentsList,
} from '@/services/content.api';
import { UsersList } from '@/services/users.api';
import { useQuery } from '@tanstack/react-query';

export function useUsersList(params: {
  userRole: 'VIEWER' | 'UPLOADER';
  page: number;
  keyword?: string;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}) {
  const {
    userRole,
    page,
    keyword = '',
    size = 10,
    sortBy = 'createdAt',
    direction = 'DESC',
  } = params;

  const apiPage = page - 1;
  return useQuery({
    queryKey: ['users', params],
    queryFn: () =>
      UsersList({ userRole, keyword, page: apiPage, size, sortBy, direction }),
  });
}
