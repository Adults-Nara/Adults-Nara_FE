import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  UserDetailResponse,
  UserResponse,
  UpdateUserRequest,
} from '@/models/user.model';

export const getUserDetail = async (userId: number) => {
  const response = await httpClient<ApiResponse<UserDetailResponse>>(
    API_ENDPOINTS.USERS.DETAIL(userId),
    { method: 'GET' },
  );
  return response.data;
};

export const deleteUser = async (reason: string) => {
  const response = await httpClient<ApiResponse<void>>(
    `${API_ENDPOINTS.USERS.DELETE}?reason=${encodeURIComponent(reason)}`,
    { method: 'DELETE' },
  );
  return response.data;
};

export const updateUser = async (data: UpdateUserRequest) => {
  const response = await httpClient<ApiResponse<UserResponse>>(
    API_ENDPOINTS.USERS.UPDATE,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const deactivateUser = async (userId: number) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.USERS.DEACTIVATE(userId),
    { method: 'POST' },
  );
  return response.data;
};

export const getUserMe = async () => {
  const response = await httpClient<ApiResponse<UserDetailResponse>>(
    API_ENDPOINTS.AUTH.ME,
    { method: 'GET' },
  );
  return response.data;
};
