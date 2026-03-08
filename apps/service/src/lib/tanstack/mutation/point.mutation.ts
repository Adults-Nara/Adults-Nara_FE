import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePolicy, rewardPurchasePoint } from '@/services/point.api';
import { PointPolicyUpdateRequest, ProductPurchaseRequest } from '@/models/point.model';

export function useRewardPurchasePoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductPurchaseRequest) => rewardPurchasePoint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pointBalance'] });
      queryClient.invalidateQueries({ queryKey: ['pointHistory'] });
    },
  });
}

export function useUpdatePointPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PointPolicyUpdateRequest) => updatePolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pointPolicies'] });
    },
  });
}
