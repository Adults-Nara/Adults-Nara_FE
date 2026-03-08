import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import { PageVideoSearchResponse } from '@/models/search.model';

export interface SearchVideosParams {
  keyword?: string;
  videoType?: 'SHORT' | 'LONG';
  tag?: string;
  page?: number;
  size?: number;
}

export const searchVideos = async (params: SearchVideosParams) => {
  const queryParams = new URLSearchParams();
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.videoType) queryParams.append('videoType', params.videoType);
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.page !== undefined)
    queryParams.append('page', params.page.toString());
  if (params.size !== undefined)
    queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : '';

  const response = await httpClient<ApiResponse<PageVideoSearchResponse>>(
    `${API_ENDPOINTS.SEARCH.BASE}${queryString}`,
    { method: 'GET' },
  );
  return response.data;
};

export const autocomplete = async (keyword: string) => {
  const response = await httpClient<ApiResponse<string[]>>(
    `${API_ENDPOINTS.SEARCH.AUTOCOMPLETE}?keyword=${encodeURIComponent(keyword)}`,
    { method: 'GET' },
  );
  return response.data;
};
