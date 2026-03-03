import { User } from '@/types/user';
import { ApiResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/constant/endpoints';
import { httpClient } from './httpClient';

export const loginKakaoUrl = async () => {
  const response = await httpClient<ApiResponse<string>>(
    API_ENDPOINTS.AUTH.KAKAO_LOGIN_URL,
  );
  return response.data;
};

export const loginWithKakao = async (code: string, state: string) => {
  const params = new URLSearchParams({
    code: code,
    state: state,
  }).toString();

  const response = await httpClient<ApiResponse<User>>(
    `${API_ENDPOINTS.AUTH.KAKAO_LOGIN}?${params}`,
  );

  return response.data;
};
