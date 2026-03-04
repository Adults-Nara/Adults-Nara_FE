export interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  role: 'UPLOADER' | 'ADMIN';
  accessToken: string;
}
