import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  BookmarkPageResponse,
  BookmarkStatusResponseDto,
  BookmarkSummaryResponse,
} from '@/models/bookmark.model';

export const toggleBookmark = async (videoId: number) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.BOOKMARKS.TOGGLE(videoId),
    { method: 'POST' },
  );
  return response.data;
};

export const warmUpBookmarks = async () => {
  const response = await httpClient<ApiResponse<string>>(
    API_ENDPOINTS.BOOKMARKS.WARMUP,
    { method: 'POST' },
  );
  return response.data;
};

export const getBookmarkList = async (
  videoType: 'SHORT' | 'LONG',
  page: number = 0,
  size: number = 10,
) => {
  const response = await httpClient<ApiResponse<BookmarkPageResponse>>(
    `${API_ENDPOINTS.BOOKMARKS.BASE}?videoType=${videoType}&page=${page}&size=${size}`,
    { method: 'GET' },
  );
  return response.data;
};

export const getBookmarkStatus = async (videoId: number) => {
  const response = await httpClient<ApiResponse<BookmarkStatusResponseDto>>(
    API_ENDPOINTS.BOOKMARKS?.STATUS(videoId),
    { method: 'GET' },
  );
  return response.data;
};

export const getBookmarkSummary = async () => {
  const response = await httpClient<ApiResponse<BookmarkSummaryResponse>>(
    API_ENDPOINTS.BOOKMARKS.SUMMARY,
    { method: 'GET' },
  );
  return response.data;
};
