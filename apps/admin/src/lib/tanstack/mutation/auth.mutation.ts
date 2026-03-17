import {
  BackofficeLoginRequest,
  BackofficeSignRequest,
} from '@/models/auth.model';
import {
  BackofficeAccount,
  BackofficeCheckEmail,
  BackofficeLogin,
  BackofficeLogout,
  BackofficeSignUp,
} from '@/services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useBackofficeLogin() {
  return useMutation({
    mutationFn: (data: BackofficeLoginRequest) => BackofficeLogin(data),
  });
}

export function useBackofficeSign() {
  return useMutation({
    mutationFn: (data: BackofficeSignRequest) => BackofficeSignUp(data),
  });
}

export function useBackofficeCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => BackofficeCheckEmail(email),
  });
}

export function useBackofficeLogout() {
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthStore.getState();
  return useMutation({
    mutationFn: () => BackofficeLogout(),
    onSuccess: () => {
      queryClient.clear();
      setAccessToken(null, null);
    },
  });
}

export function useBackofficeAccount() {
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthStore.getState();
  return useMutation({
    mutationFn: () => BackofficeAccount(),
    onSuccess: () => {
      queryClient.clear();
      setAccessToken(null, null);
    },
  });
}
