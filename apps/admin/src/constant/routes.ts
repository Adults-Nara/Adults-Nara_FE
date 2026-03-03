export const ROUTES = {
  HOME: '/home',
  CONTENT: '/content',
  UPLOADER: '/uploader',
  USER: '/user',
  NEW_CONTENT: '/content/new',
  EDIT_CONTENT: (videoId: string | number) => `/content/${videoId}/edit`,
} as const;
