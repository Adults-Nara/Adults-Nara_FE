import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  SubscriptionResponse,
  RegisterRequest,
  RegisterResponse,
  PlanInfo,
  DiscountHistoryResponse,
  VerifyResponse,
} from '@/models/uplus.model';

export const myUplusVerify = async (data: { phoneNumber: string }) => {
  const response = await httpClient<ApiResponse<VerifyResponse>>(
    API_ENDPOINTS.UPLUS.VERIFY,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const getMySubscription = async () => {
  const response = await httpClient<ApiResponse<SubscriptionResponse>>(
    API_ENDPOINTS.UPLUS.SUBSCRIPTION,
    { method: 'GET' },
  );
  return response.data;
};

export const registerSubscription = async (data: RegisterRequest) => {
  const response = await httpClient<ApiResponse<RegisterResponse>>(
    API_ENDPOINTS.UPLUS.SUBSCRIPTION,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const deactivateSubscription = async () => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.UPLUS.SUBSCRIPTION,
    { method: 'DELETE' },
  );
  return response.data;
};

export const syncPlan = async () => {
  const response = await httpClient<ApiResponse<SubscriptionResponse>>(
    API_ENDPOINTS.UPLUS.SYNC_PLAN,
    { method: 'PATCH' },
  );
  return response.data;
};

export const getPlans = async () => {
  const response = await httpClient<ApiResponse<PlanInfo[]>>(
    API_ENDPOINTS.UPLUS.PLANS,
    { method: 'GET' },
  );
  return response.data;
};

export const getDiscountHistory = async () => {
  const response = await httpClient<ApiResponse<DiscountHistoryResponse[]>>(
    API_ENDPOINTS.UPLUS.DISCOUNT_HISTORY,
    { method: 'GET' },
  );
  return response.data;
};
