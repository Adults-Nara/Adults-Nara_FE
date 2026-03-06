export type UserRole = 'VIEWER' | 'UPLOADER' | 'ADMIN';
export type UserStatus =
  | 'ACTIVE'
  | 'DEACTIVATED'
  | 'SUSPENDED_7'
  | 'SUSPENDED_15'
  | 'SUSPENDED_30'
  | 'DELETED';

export interface UserDetailResponse {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  role: UserRole;
  oauthProvider?: string;
  oauthId?: string;
  banned: UserStatus;
  bannedUntil?: string;
  banReason?: string;
  bannedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  role: UserRole;
  banned: UserStatus;
  createdAt: string;
}

export interface UpdateUserRequest {
  nickname?: string;
  password?: string;
  profileImageUrl?: string;
  preferredTagIds?: number[];
}
