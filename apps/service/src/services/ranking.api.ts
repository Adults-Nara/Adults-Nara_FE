import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { RankingResponse } from '@/models/ranking.model';

export const getBookmarkRanking = async (limit: number = 10) => {
  const response = await httpClient<ApiResponse<RankingResponse[]>>(
    `${API_ENDPOINTS.RANKING.BASE}?limit=${limit}`,
    { method: 'GET' },
  );
  return response.data;
};
