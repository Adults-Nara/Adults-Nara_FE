import { useQuery } from '@tanstack/react-query';
import {
  getAllPolicies,
  getMyPointBalance,
  getMyPointTransactionHistory,
} from '@/services/point.api';
import {
  PointPolicyUpdateRequest,
  ProductPurchaseRequest,
  PointTransactionHistoryRequest,
} from '@/models/point.model';

// User Queries
export function useMyPointBalance() {
  return useQuery({
    queryKey: ['pointBalance'],
    queryFn: () => getMyPointBalance(),
  });
}

export function useMyPointTransactionHistory(
  params: PointTransactionHistoryRequest,
) {
  return useQuery({
    queryKey: ['pointHistory', params],
    queryFn: () => getMyPointTransactionHistory(params),
  });
}

// Admin Queries
export function useAllPointPolicies() {
  return useQuery({
    queryKey: ['pointPolicies'],
    queryFn: () => getAllPolicies(),
  });
}
