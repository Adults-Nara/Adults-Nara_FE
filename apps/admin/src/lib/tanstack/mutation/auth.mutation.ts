import { BackofficeLoginRequest } from '@/models/auth.model';
import { BackofficeLogin } from '@/services/auth.api';
import { useMutation } from '@tanstack/react-query';

export function useBackofficeLogin() {
  return useMutation({
    mutationFn: (data: BackofficeLoginRequest) => BackofficeLogin(data),
  });
}
