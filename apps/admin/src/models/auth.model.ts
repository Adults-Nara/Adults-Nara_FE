export interface BackofficeLoginRequest {
  email: string;
  password: string;
}

export interface BackofficeSignRequest {
  email: string;
  password: string;
  nickname: string;
}
export interface BackofficeSignResponses {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  role: string; //TODO:추후 eunm값으로
  banned: string; //TODO:추후 eunm값으로
  createdAt: string;
}
