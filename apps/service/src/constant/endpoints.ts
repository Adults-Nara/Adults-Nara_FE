export const API_ENDPOINTS = {
  AUTH: {
    KAKAO_LOGIN: '/auth/kakao/callback',
    KAKAO_LOGIN_URL: '/auth/kakao/login-url',
    LOGOUT: '/auth/token/logout',
    REFRESH: '/auth/token/refresh',
  },

  RECOMMENDATION: {
    RELATED: (videoId: string) => `/recommendations/${videoId}/related`,
    FEED: '/recommendations/feed',
    FEED_VERTICAL: '/recommendations/feed/vertical',
  },
} as const;
