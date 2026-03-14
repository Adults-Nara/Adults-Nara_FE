export interface SubscriptionResponse {
  maskedPhoneNumber: string;
  plan: string;
  planDisplayName: string;
  monthlyFee: number;
  active: boolean;
}

export interface RegisterRequest {
  phoneNumber: string;
}

export interface RegisterResponse {
  registered: boolean;
  message: string;
  subscription?: SubscriptionResponse;
}

export interface PlanInfo {
  code: string;
  displayName: string;
  monthlyFee: number;
}

export interface DiscountHistoryResponse {
  billingYearMonth: string;
  planDisplayName: string;
  discountAmount: number;
}

export interface VerifyResponse {
  verified: boolean;
  message: string;
  subscription: SubscriptionResponse;
}
