export const ROUTES = {
  HOME: '/home',
  SHORTS: '/shorts',
  LONG: '/long',
  MYPAGE: '/mypage',
  CATEGORY: '/mypage/category',
  POINT: '/mypage/point',
  SEARCH: (query?: string) => {
    if (!query?.trim()) return '/search';
    const params = new URLSearchParams({ keyword: query.trim() });
    return `/search?${params.toString()}`;
  },
  LOGIN: '/login',
} as const;
