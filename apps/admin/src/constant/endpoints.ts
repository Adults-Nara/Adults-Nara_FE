export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/backoffice/auth/login',
    SIGNUP: '/backoffice/auth/signup/uploader',
    ACCOUNT: '/backoffice/auth/account',
    CHECK_EMAIL: (query: string) => {
      const params = new URLSearchParams({ email: query.trim() });
      return `/backoffice/auth/check-email?${params.toString()}`;
    },
    LOGOUT: '/auth/token/logout',
    REFRESH: '/auth/token/refresh',
    ME: '/auth/me',
  },
  CONTENTS: {
    INIT: '/videos/upload/multipart/init',
    COMPLETE: (videoId: string) =>
      `/videos/${videoId}/upload/multipart/complete`,
    UPLOAD: (videoId: string) => `/videos/${videoId}/upload`,
    EDIT: (videoId: string) => `/backoffice/contents/${videoId}`,
    DETAIL: (videoId: string) => `/backoffice/contents/${videoId}`,
    UPLOADER_CONTENTS_LIST: '/backoffice/uploader/contents',
    ADMIN_CONTENTS_LIST: '/backoffice/admin/contents',
  },
} as const;
