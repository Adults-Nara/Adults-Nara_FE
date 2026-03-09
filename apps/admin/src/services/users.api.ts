import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import {
  UsersDeleteRequest,
  UsersListResponse,
  UsersStatusRequest,
} from '@/models/users.model';

export const UsersList = async (params: {
  userRole: 'VIEWER' | 'UPLOADER';
  keyword?: string;
  page: number;
  size: number;
  sortBy: string;
  direction: 'ASC' | 'DESC';
}) => {
  const searchParams = new URLSearchParams({
    userRole: params.userRole,
    keyword: params.keyword ?? '',
    page: String(params.page),
    size: String(params.size),
    sortBy: params.sortBy,
    direction: params.direction,
  });
  const response = await httpClient<ApiResponse<UsersListResponse>>(
    `${API_ENDPOINTS.USERS.USER_LIST}?${searchParams}`,
    {
      method: 'GET',
    },
  );
  return response.data;
};

export const UsersStatus = async (data: UsersStatusRequest) => {
  const response = await httpClient<ApiResponse<{ userIds: string[] }>>(
    API_ENDPOINTS.USERS.USER_STATUS,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const UsersDelete = async (data: UsersDeleteRequest) => {
  const response = await httpClient<ApiResponse<null>>(
    API_ENDPOINTS.USERS.USER_DELETE,
    {
      method: 'DELETE',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};
