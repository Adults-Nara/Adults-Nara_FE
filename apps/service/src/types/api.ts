export type ApiResponse<T> = {
  success: 'SUCCESS' | 'ERROR';
  data: T;
  error: ApiError | null;
};

export type ApiError = {
  code: string;
  message: string;
  errors: Array<{
    field: string;
    reason: string;
  }>;
};
