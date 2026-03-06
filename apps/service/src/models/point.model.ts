export type PointPolicyName = 'AD_REWARD' | 'PURCHASE_RATE' | 'DAILY_AD_LIMIT';
export type PointTransactionType =
  | 'AD_REWARD'
  | 'PURCHASE_BONUS'
  | 'GIFTICON_PURCHASE'
  | 'UPLUS_DISCOUNT';

export interface PointPolicyResponse {
  policyName: PointPolicyName;
  description: string;
  policyValue: number;
}

export interface PointPolicyUpdateRequest {
  policyName: PointPolicyName;
  policyValue: number;
}

export interface ProductPurchaseRequest {
  orderId: number;
  productId: number;
  price: number;
}

export interface UserPointBalanceResponse {
  currentBalance: number;
  lastUpdated: string;
}

export interface PointTransactionHistoryRequest {
  startDate?: string;
  endDate?: string;
}

export interface PointTransactionHistoryResponse {
  transactionId: number;
  amount: number;
  type: PointTransactionType;
  balanceAfterTransaction: number;
  createdAt: string;
}
