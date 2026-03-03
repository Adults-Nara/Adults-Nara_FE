export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/backoffice/auth/login',
    SIGNUP: '/backoffice/auth/signup/uploader',
    ACCOUNT: '/backoffice/auth/account',
    CHECK_EMAIL: '/backoffice/auth/check-email',
    LOGOUT: '/auth/token/logout',
    REFRESH: '/auth/token/refresh',
  },
} as const;
