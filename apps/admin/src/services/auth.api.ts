import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/constant/endpoints';
import { BackofficeLoginRequest } from '@/models/auth.model';

export const BackofficeLogin = async (data: BackofficeLoginRequest) => {
  const response = await httpClient<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};
