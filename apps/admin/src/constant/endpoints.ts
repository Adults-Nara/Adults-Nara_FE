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
  },
} as const;
