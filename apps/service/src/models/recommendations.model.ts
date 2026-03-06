export interface RecommendationVideoItem {
  videoId: string;
  userId: number;
  uploaderNickname: string;
  uploaderProfileImageUrl: string | null;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  tags: string[];
  viewCount: number;
  likeCount: number;
  uploadDate: string;
  videoType: 'SHORT' | 'LONG';
  watchProgress: number;
  otherVideoUrl: string;
}

export interface RecommendationVideoResponse {
  content: RecommendationVideoItem[];
}
