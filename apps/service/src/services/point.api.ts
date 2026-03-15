import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  PointPolicyResponse,
  PointPolicyUpdateRequest,
  ProductPurchaseRequest,
  UserPointBalanceResponse,
  PointTransactionHistoryRequest,
  PointTransactionHistoryResponse,
} from '@/models/point.model';

export const getAllPolicies = async () => {
  const response = await httpClient<ApiResponse<PointPolicyResponse[]>>(
    API_ENDPOINTS.ADMIN.POINT_POLICIES,
    { method: 'GET' },
  );
  return response.data;
};

export const updatePolicy = async (data: PointPolicyUpdateRequest) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.ADMIN.POINT_POLICIES,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const rewardPurchasePoint = async (data: ProductPurchaseRequest) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.POINT.REWARD_PURCHASE,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const getMyPointBalance = async () => {
  const response = await httpClient<ApiResponse<UserPointBalanceResponse>>(
    API_ENDPOINTS.POINT.BASE,
    { method: 'GET' },
  );
  return response.data;
};

export const getMyPointTransactionHistory = async (
  params: PointTransactionHistoryRequest,
) => {
  const queryParams = new URLSearchParams();

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  queryParams.append('page', params.page?.toString() ?? '0');
  if (params.size) {
    queryParams.append('size', params.size.toString());
  } else {
    queryParams.append('size', '10');
  }

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : '';

  const response = await httpClient<
    ApiResponse<PointTransactionHistoryResponse>
  >(`${API_ENDPOINTS.POINT.HISTORY}${queryString}`, { method: 'GET' });

  return response.data;
};
