import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getAllPolicies,
  getMyPointBalance,
  getMyPointTransactionHistory,
} from '@/services/point.api';
import { PointTransactionHistoryRequest } from '@/models/point.model';

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
  return useInfiniteQuery({
    queryKey: ['pointHistory', params],
    queryFn: ({ pageParam = 0 }) =>
      getMyPointTransactionHistory({
        ...params,
        page: pageParam,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
}

// Admin Queries
export function useAllPointPolicies() {
  return useQuery({
    queryKey: ['pointPolicies'],
    queryFn: () => getAllPolicies(),
  });
}
