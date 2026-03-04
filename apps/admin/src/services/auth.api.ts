import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/constant/endpoints';
import {
  BackofficeLoginRequest,
  BackofficeSignRequest,
  BackofficeSignResponses,
} from '@/models/auth.model';

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
export const BackofficeLogout = async () => {
  await httpClient(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
  });
};

export const BackofficeSignUp = async (data: BackofficeSignRequest) => {
  const response = await httpClient<ApiResponse<BackofficeSignResponses>>(
    API_ENDPOINTS.AUTH.SIGNUP,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const BackofficeCheckEmail = async (email: string) => {
  const response = await httpClient<ApiResponse<boolean>>(
    API_ENDPOINTS.AUTH.CHECK_EMAIL(email),
    {
      method: 'GET',
    },
  );
  return response.data;
};
