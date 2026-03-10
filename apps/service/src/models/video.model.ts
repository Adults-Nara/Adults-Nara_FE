export interface VideoS3UrlResponse {
  masterUrl: string;
  expiresAtEpochSeconds: number;
}

export interface VideoDetailWatchHistory {
  videoId: string;
  lastPosition: number;
  duration: number;
}

export interface VideoDetailResponse {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  tagIds: string[];
  createdAt: string;
  otherVideoUrl: string;
  userProfile: string;
  userNickname: string;
  aiTagIds: string[];
  summary: string;
  watchHistory: VideoDetailWatchHistory | null;
}
