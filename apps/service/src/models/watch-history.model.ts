export interface WatchPositionRequest {
  lastPosition: number;
  watchSeconds: number;
}

export interface WatchHistoryResponse {
  videoId: string;
  lastPosition: number;
  duration: number;
}

export interface WatchHistoryItemResponse {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  uploaderName: string;
  watchProgressPercent: number;
  watchedAt: string;
  duration: number;
  videoType: 'SHORT' | 'LONG';
  uploadedAt: string;
}

export interface WatchHistoryPageResponse {
  items: WatchHistoryItemResponse[];
  hasMore: boolean;
}
