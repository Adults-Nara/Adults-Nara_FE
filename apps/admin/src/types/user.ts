export interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  role: 'VIEWER' | 'UPLOADER' | 'ADMIN';
  accessToken: string;
}
