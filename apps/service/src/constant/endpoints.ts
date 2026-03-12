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
    DETAIL: (videoId: number) => `/videos/${videoId}`,
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
    POSITION: (videoId: number) => `/watch/${videoId}`,
    UPDATE_POSITION: (videoId: number) => `/watch/${videoId}/position`,
    STOP: (videoId: number) => `/watch/${videoId}/stop`,
    RECENT: '/watch/history/recent',
  },
  INTERACTIONS: {
    MY_STATUS: (videoId: number) => `/interactions/${videoId}/my-status`,
    LIKE: (videoId: number) => `/interactions/${videoId}/like`,
    DISLIKE: (videoId: number) => `/interactions/${videoId}/dislike`,
    SUPERLIKE: (videoId: number) => `/interactions/${videoId}/superlike`,
  },
  USERS: {
    DETAIL: (userId: number) => `/users/${userId}`,
    DEACTIVATE: (userId: number) => `/users/${userId}/deactivate`,
    UPDATE: '/users/me',
    DELETE: '/users/me',
  },
  COMMENTS: {
    BASE: (videoId: number) => `/comment/videos/${videoId}`,
    DETAIL: (commentId: number) => `/comment/${commentId}`,
    MY: (videoId: number) => `/comment/videos/${videoId}/me`,
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
    TOGGLE: (videoId: number) => `/bookmarks/${videoId}`,
    WARMUP: '/bookmarks/admin/warmup',
    STATUS: (videoId: number) => `/bookmarks/${videoId}/status`,
    SUMMARY: '/bookmarks/summary',
  },
  UPLUS: {
    SUBSCRIPTION: '/uplus/subscription',
    SYNC_PLAN: '/uplus/subscription/plan',
    PLANS: '/uplus/plans',
    DISCOUNT_HISTORY: '/uplus/discount/history',
  },
} as const;
