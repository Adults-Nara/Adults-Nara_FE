export interface RecommendationVideoItem {
  videoId: string;
  thumbnailSrc: string;
  title: string;
  uploader: string;
  uploaderProfileImageUrl: string | null;
  progress: number;
  duration: number;
  views: number;
  date: string;
  userId: number;
  videoType: 'SHORT' | 'LONG';
}

export interface RecommendationVideoResponse {
  content: RecommendationVideoItem[];
  currentPage: number;
  size: number;
  hasNext: boolean;
}
