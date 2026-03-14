import { useQuery } from '@tanstack/react-query';
import {
  getMySubscription,
  getPlans,
  getDiscountHistory,
  myUplusVerify,
} from '@/services/uplus.api';

export function useMyuplusVerify(data: { phoneNumber: string }) {
  return useQuery({
    queryKey: ['uplus', 'verify', data.phoneNumber],
    queryFn: () => myUplusVerify(data),
    enabled: !!data.phoneNumber,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['uplus', 'subscription'],
    queryFn: () => getMySubscription(),
  });
}

export function useUplusPlans() {
  return useQuery({
    queryKey: ['uplus', 'plans'],
    queryFn: () => getPlans(),
  });
}

export function useUplusDiscountHistory() {
  return useQuery({
    queryKey: ['uplus', 'discountHistory'],
    queryFn: () => getDiscountHistory(),
  });
}
