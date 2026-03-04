import { BackofficeMe } from '@/services/auth.api';
import { useQuery } from '@tanstack/react-query';

export function useBackofficeMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => BackofficeMe(),
  });
}
