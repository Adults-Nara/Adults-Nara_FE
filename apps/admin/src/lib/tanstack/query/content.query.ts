import { UploaderConentsList } from '@/services/content.api';
import { useQuery } from '@tanstack/react-query';

export function useContentsList(params: {
  page: number;
  keyword?: string;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}) {
  const {
    page,
    keyword = '',
    size = 10,
    sortBy = 'createdAt',
    direction = 'DESC',
  } = params;

  return useQuery({
    queryKey: ['contents', 'uploader', params],
    queryFn: () =>
      UploaderConentsList({
        keyword,
        page,
        size,
        sortBy,
        direction,
      }),
  });
}
