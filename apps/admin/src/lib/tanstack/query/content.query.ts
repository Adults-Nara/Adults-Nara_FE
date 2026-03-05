import { AdminConentsList, UploaderConentsList } from '@/services/content.api';
import { useQuery } from '@tanstack/react-query';

export function useContentsList(
  role: 'UPLOADER' | 'ADMIN' | null,
  params: {
    page: number;
    keyword?: string;
    size?: number;
    sortBy?: string;
    direction?: 'ASC' | 'DESC';
  },
) {
  const {
    page,
    keyword = '',
    size = 10,
    sortBy = 'createdAt',
    direction = 'DESC',
  } = params;

  const apiPage = page - 1;
  return useQuery({
    queryKey: ['contents', role, params],
    queryFn: () => {
      if (role === 'ADMIN') {
        return AdminConentsList({
          keyword,
          page: apiPage,
          size,
          sortBy,
          direction,
        });
      } else {
        return UploaderConentsList({
          keyword,
          page: apiPage,
          size,
          sortBy,
          direction,
        });
      }
    },
    enabled: !!role,
  });
}
