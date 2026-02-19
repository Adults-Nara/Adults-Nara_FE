export const ROUTES = {
  HOME: '/home',
  SHORTS: '/shorts',

  MYPAGE: '/mypage',
  SEARCH: (query?: string) => {
    if (!query?.trim()) return '/search';
    const params = new URLSearchParams({ keyword: query.trim() });
    return `/search?${params.toString()}`;
  },
  WATCH: (query?: string) => {
    if (!query?.trim()) return '/watch';
    const params = new URLSearchParams({ src: query.trim() });
    return `/watch?${params.toString()}`;
  },
} as const;
