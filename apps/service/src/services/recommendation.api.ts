import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { RecommendationVideoResponse } from '@/models/recommendations.model';

export const getRecommendationFeed = async (
  page: number = 0,
  size: number = 3,
) => {
  const response = await httpClient<ApiResponse<RecommendationVideoResponse>>(
    `${API_ENDPOINTS.RECOMMENDATION.FEED_VERTICAL}?videoType=SHORT&page=${page}&size=${size}`,
    { method: 'GET' },
  );
  return response.data;
};

export const getRecommendationRelated = async (
  videoId: string,
  page: number = 0,
  size: number = 3,
  videoType: 'SHORT' | 'LONG' = 'SHORT',
) => {
  const response = await httpClient<ApiResponse<RecommendationVideoResponse>>(
    `${API_ENDPOINTS.RECOMMENDATION.RELATED(videoId)}?videoType=${videoType}&page=${page}&size=${size}`,
    { method: 'GET' },
  );
  return response.data;
};
