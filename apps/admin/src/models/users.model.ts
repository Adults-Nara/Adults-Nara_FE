export type UserBanStatus =
  | 'ACTIVE'
  | 'DEACTIVATED'
  | 'SUSPENDED_7'
  | 'SUSPENDED_15'
  | 'SUSPENDED_30';

export interface UsersListResponse {
  content: UsersItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UsersItem {
  userId: string;
  profileImageUrl: string;
  nickname: string;
  email: string;
  banStatus: UserBanStatus;
  createdAt: string;
}

export interface UsersStatusRequest {
  userIds: string[];
  banStatus: UserBanStatus;
  banReason: string;
}
export interface UsersDeleteRequest {
  userIds: string[];
}
