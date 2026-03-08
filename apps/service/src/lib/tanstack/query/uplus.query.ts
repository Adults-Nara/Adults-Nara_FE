import { useQuery } from '@tanstack/react-query';
import {
  getMySubscription,
  getPlans,
  getDiscountHistory,
} from '@/services/uplus.api';
import { RegisterRequest } from '@/models/uplus.model';

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
