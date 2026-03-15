import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { AdResponse } from '@/models/ad.model';

// GET /api/v1/ads?videoId={videoId}
export const getAd = async (videoId: string): Promise<AdResponse> => {
  const response = await httpClient<ApiResponse<AdResponse>>(
    `${API_ENDPOINTS.AD.BASE}?videoId=${videoId}`,
    { method: 'GET' },
  );
  return response.data;
};
