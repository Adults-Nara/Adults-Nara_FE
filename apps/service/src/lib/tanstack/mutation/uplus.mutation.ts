import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  registerSubscription,
  deactivateSubscription,
  syncPlan,
  myUplusVerify,
} from '@/services/uplus.api';
import { RegisterRequest } from '@/models/uplus.model';
import { useAuthStore } from '@/store/useAuthStore';

export function useRegisterSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uplus', 'subscription'] });
    },
  });
}

export function useDeactivateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deactivateSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uplus', 'subscription'] });
    },
  });
}

export function useSyncPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => syncPlan(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uplus', 'subscription'] });
    },
  });
}

export function useMyuplusVerifyMutation() {
  const queryClient = useQueryClient();
  const { setPhoneNumber } = useAuthStore.getState();
  return useMutation({
    mutationFn: (data: { phoneNumber: string }) => myUplusVerify(data),
    onSuccess: (data, variables) => {
      if (data.verified) {
        setPhoneNumber(variables.phoneNumber);
        queryClient.invalidateQueries({ queryKey: ['uplus', 'verify'] });
      }
    },
  });
}
