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
    ME: '/auth/me',
  },

  RECOMMENDATION: {
    RELATED: (videoId: string) => `/recommendations/${videoId}/related`,
    FEED: '/recommendations/feed',
    FEED_VERTICAL: '/recommendations/feed/vertical',
  },

  VIDEO: {
    DETAIL: (videoId: string) => `/videos/${videoId}`,
    S3_URL: (videoId: string) => `/videos/${videoId}/play`,
  },
  TAGS: {
    PARENT_WITH_CHILD: '/tags/parent-with-child',
    MY_CHILD_TAGS: '/tags/my-child-tags',
    VIDEOS: (tagId: number) => `/tags/${tagId}/videos`,
    WATCH_STATS: '/user-tag/tag-watch-stats',
    UPDATE: '/user-tag',
    ONBOARDING: '/user-tag/onboarding',
  },
  WATCH: {
    POSITION: (videoId: string) => `/watch/${videoId}`,
    UPDATE_POSITION: (videoId: string) => `/watch/${videoId}/position`,
    STOP: (videoId: string) => `/watch/${videoId}/stop`,
    RECENT: '/watch/history/recent',
  },
  INTERACTIONS: {
    MY_STATUS: (videoId: string) => `/interactions/${videoId}/my-status`,
    LIKE: (videoId: string) => `/interactions/${videoId}/like`,
    DISLIKE: (videoId: string) => `/interactions/${videoId}/dislike`,
    SUPERLIKE: (videoId: string) => `/interactions/${videoId}/superlike`,
  },
  USERS: {
    DETAIL: (userId: number) => `/users/${userId}`,
    DEACTIVATE: (userId: number) => `/users/${userId}/deactivate`,
  },
  COMMENTS: {
    BASE: (videoId: string) => `/comment/videos/${videoId}`,
    DETAIL: (commentId: number) => `/comment/${commentId}`,
    MY: (videoId: string) => `/comment/videos/${videoId}/me`,
  },
  ADMIN: {
    POINT_POLICIES: '/admin/point/policies',
  },
  POINT: {
    BASE: '/point',
    HISTORY: '/point/history',
    REWARD_PURCHASE: '/point/reward/purchase',
  },
  SEARCH: {
    BASE: '/search',
    AUTOCOMPLETE: '/search/autocomplete',
  },
  RANKING: {
    BASE: '/ranking',
  },
  BOOKMARKS: {
    BASE: '/bookmarks',
    TOGGLE: (videoId: string) => `/bookmarks/${videoId}`,
    WARMUP: '/bookmarks/admin/warmup',
    STATUS: (videoId: string) => `/bookmarks/${videoId}/status`,
    SUMMARY: '/bookmarks/summary',
  },
  UPLUS: {
    SUBSCRIPTION: '/uplus/subscription',
    SYNC_PLAN: '/uplus/subscription/plan',
    PLANS: '/uplus/plans',
    DISCOUNT_HISTORY: '/uplus/discount/history',
  },
  AD: {
    BASE: '/ads',
  },
} as const;
