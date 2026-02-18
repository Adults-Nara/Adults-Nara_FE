export const ROUTES = {
  HOME: '/home',
  SHORTS: '/shorts',
  MYPAGE: '/mypage',
  SEARCH: (query?: string) => (query ? `/search?keyword=${query}` : '/search'),
  WATCH: (query?: string) => (query ? `/watch?src=${query}` : '/watch'),
} as const;
