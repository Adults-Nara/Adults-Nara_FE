import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';
import { httpClient } from './httpClient';
import {
  CommentPageResponse,
  MyCommentResponse,
  CommentCreateRequest,
  CommentEditRequest,
} from '@/models/comment.model';

export const getComments = async (
  videoId: number,
  page: number = 0,
  size: number = 20,
) => {
  const response = await httpClient<ApiResponse<CommentPageResponse>>(
    `${API_ENDPOINTS.COMMENTS.BASE(videoId)}?page=${page}&size=${size}`,
    { method: 'GET' },
  );
  return response.data;
};

export const createComment = async (
  videoId: number,
  data: CommentCreateRequest,
) => {
  const response = await httpClient<ApiResponse<MyCommentResponse>>(
    API_ENDPOINTS.COMMENTS.BASE(videoId),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await httpClient<ApiResponse<void>>(
    API_ENDPOINTS.COMMENTS.DETAIL(commentId),
    { method: 'DELETE' },
  );
  return response.data;
};

export const editComment = async (
  commentId: number,
  data: CommentEditRequest,
) => {
  const response = await httpClient<ApiResponse<MyCommentResponse>>(
    API_ENDPOINTS.COMMENTS.DETAIL(commentId),
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

export const getMyComment = async (videoId: number) => {
  const response = await httpClient<ApiResponse<MyCommentResponse>>(
    API_ENDPOINTS.COMMENTS.MY(videoId),
    { method: 'GET' },
  );
  return response.data;
};
