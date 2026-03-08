import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  ChildTagResponse,
  ParentTagWithChildResponse,
  TagVideoResponse,
  TagWatchStatsResponse,
  UpdateUserTagRequest,
  OnboardingTagRequest,
  TagScoreDto,
} from '@/models/tag.model';

// 부모 태그 + 자식 태그 목록 조회
export const getParentTagsWithChild = async () => {
  const response = await httpClient<ApiResponse<ParentTagWithChildResponse[]>>(
    API_ENDPOINTS.TAGS.PARENT_WITH_CHILD,
    { method: 'GET' },
  );
  return response.data;
};

// 내 관심 태그(자식) 목록 조회
export const getMyChildTags = async () => {
  const response = await httpClient<ApiResponse<ChildTagResponse[]>>(
    API_ENDPOINTS.TAGS.MY_CHILD_TAGS,
    { method: 'GET' },
  );
  return response.data;
};

// 태그별 영상 목록 조회
export const getVideosByTag = async (tagId: number) => {
  const response = await httpClient<ApiResponse<TagVideoResponse[]>>(
    API_ENDPOINTS.TAGS.VIDEOS(tagId),
    { method: 'GET' },
  );
  return response.data;
};

// 태그별 시청 통계 조회
export const getTagWatchStats = async () => {
  const response = await httpClient<ApiResponse<TagWatchStatsResponse[]>>(
    API_ENDPOINTS.TAGS.WATCH_STATS,
    { method: 'GET' },
  );
  return response.data;
};

// 관심 태그 수정
export const updateUserTags = async (body: UpdateUserTagRequest) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.TAGS.UPDATE,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
  );
  return response.data;
};

// 온보딩 태그 저장
export const saveOnboardingTags = async (body: OnboardingTagRequest) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.TAGS.ONBOARDING,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
  return response.data;
};

// 특정 유저 선호 태그 조회 (관리자)
export const getUserPreferences = async (
  userId: number,
  limit: number = 10,
) => {
  const response = await httpClient<ApiResponse<TagScoreDto[]>>(
    `/api/v1/preferences/${userId}?limit=${limit}`,
    { method: 'GET' },
  );
  return response.data;
};

// 내 선호 태그 조회
export const getMyPreferences = async (limit: number = 10) => {
  const response = await httpClient<ApiResponse<TagScoreDto[]>>(
    `/api/v1/preferences/me?limit=${limit}`,
    { method: 'GET' },
  );
  return response.data;
};
