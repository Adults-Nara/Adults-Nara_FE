import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { InteractionStatusResponse } from '@/models/interaction.model';

// 내 반응 조회
export const getMyInteractionStatus = async (videoId: number) => {
  const response = await httpClient<ApiResponse<InteractionStatusResponse>>(
    API_ENDPOINTS.INTERACTIONS.MY_STATUS(videoId),
    { method: 'GET' },
  );
  return response.data;
};

// 좋아요
export const likeVideo = async (videoId: number) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.INTERACTIONS.LIKE(videoId),
    { method: 'POST' },
  );
  return response.data;
};

// 싫어요
export const dislikeVideo = async (videoId: number) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.INTERACTIONS.DISLIKE(videoId),
    { method: 'POST' },
  );
  return response.data;
};

// 슈퍼라이크
export const superLikeVideo = async (videoId: number) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.INTERACTIONS.SUPERLIKE(videoId),
    { method: 'POST' },
  );
  return response.data;
};
