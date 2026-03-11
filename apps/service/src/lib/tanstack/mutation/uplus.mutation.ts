import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  registerSubscription,
  deactivateSubscription,
  syncPlan,
} from '@/services/uplus.api';
import { RegisterRequest } from '@/models/uplus.model';

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
