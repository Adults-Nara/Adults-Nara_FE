import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  WatchPositionRequest,
  WatchHistoryResponse,
  WatchHistoryPageResponse,
} from '@/models/watch-history.model';

// 시청 위치 조회
export const getWatchHistory = async (videoId: number) => {
  const response = await httpClient<ApiResponse<WatchHistoryResponse>>(
    API_ENDPOINTS.WATCH.POSITION(videoId),
    { method: 'GET' },
  );
  return response.data;
};

// 시청 위치 업데이트 (10초마다 호출)
export const updateWatchPosition = async (
  videoId: number,
  body: WatchPositionRequest,
) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.WATCH.UPDATE_POSITION(videoId),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
  return response.data;
};

// 시청 종료
export const stopWatching = async (
  videoId: number,
  body: WatchPositionRequest,
) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.WATCH.STOP(videoId),
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
  return response.data;
};

// 최근 시청 이력 조회
export const getRecentWatchHistory = async (page = 0, size = 10) => {
  const response = await httpClient<ApiResponse<WatchHistoryPageResponse>>(
    `${API_ENDPOINTS.WATCH.RECENT}?page=${page}&size=${size}`,
    { method: 'GET' },
  );
  return response.data;
};
