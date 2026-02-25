export const ROUTES = {
  HOME: '/home',
  CONTENT: '/content',
  UPLOADER: '/uploader',
  USER: '/user',
  NEWCONTENT: '/content/new',
  EDITCONTENT: (videoId: string | number) => `/content/${videoId}/edit`,
} as const;
