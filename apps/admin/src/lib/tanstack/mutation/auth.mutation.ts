import {
  BackofficeLoginRequest,
  BackofficeSignRequest,
} from '@/models/auth.model';
import {
  BackofficeCheckEmail,
  BackofficeLogin,
  BackofficeSignUp,
} from '@/services/auth.api';
import { useMutation } from '@tanstack/react-query';

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
