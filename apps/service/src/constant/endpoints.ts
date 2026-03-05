export const API_ENDPOINTS = {
  AUTH: {
    KAKAO_LOGIN: (code: string, state: string) => {
      const params = new URLSearchParams({
        code: code.trim(),
        state: state.trim(),
      });
      return `/auth/kakao/login?${params.toString()}`;
    },
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
