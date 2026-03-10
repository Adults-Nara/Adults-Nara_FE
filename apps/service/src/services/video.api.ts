import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { VideoS3UrlResponse, VideoDetailResponse } from '@/models/video.model';

export const getVideoS3Url = async (videoId: string) => {
  const response = await httpClient<ApiResponse<VideoS3UrlResponse>>(
    API_ENDPOINTS.VIDEO.S3_URL(videoId),
    {
      method: 'GET',
    },
  );
  return response.data;
};

export const getVideoDetail = async (videoId: string | number) => {
  const response = await httpClient<ApiResponse<VideoDetailResponse>>(
    API_ENDPOINTS.VIDEO.DETAIL(videoId),
    {
      method: 'GET',
    },
  );
  return response.data;
};
