export type ApiResponse<T> = {
  result: 'SUCCESS' | 'ERROR';
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
