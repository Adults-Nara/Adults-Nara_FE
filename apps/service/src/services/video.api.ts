import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { RecommendationVideoResponse } from '@/models/recommendations.model';
import { VideoS3UrlResponse } from '@/models/video.model';

// 추천 피드 조회
export const getRecommendationFeed = async () => {
  const response = await httpClient<ApiResponse<RecommendationVideoResponse>>(
    API_ENDPOINTS.RECOMMENDATION.FEED,
    {
      method: 'GET',
    },
  );
  return response.data;
};

export const getRecommendationRelated = async (videoId: string) => {
  const response = await httpClient<ApiResponse<RecommendationVideoResponse>>(
    API_ENDPOINTS.RECOMMENDATION.RELATED(videoId),
    {
      method: 'GET',
    },
  );
  return response.data;
};

export const getVideoS3Url = async (videoId: string) => {
  const response = await httpClient<ApiResponse<VideoS3UrlResponse>>(
    API_ENDPOINTS.VIDEO.S3_URL(videoId),
    {
      method: 'GET',
    },
  );
  return response.data;
};
