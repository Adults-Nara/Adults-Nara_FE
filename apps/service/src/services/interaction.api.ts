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
export const likeVideo = async (videoId: string) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.INTERACTIONS.LIKE(Number(videoId)),
    { method: 'POST' },
  );
  return response.data;
};

// 싫어요
export const dislikeVideo = async (videoId: string) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.INTERACTIONS.DISLIKE(Number(videoId)),
    { method: 'POST' },
  );
  return response.data;
};

// 슈퍼라이크
export const superLikeVideo = async (videoId: string) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.INTERACTIONS.SUPERLIKE(Number(videoId)),
    { method: 'POST' },
  );
  return response.data;
};
