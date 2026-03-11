export interface RankingResponse {
  rank: number;
  rankingScore: number;
  videoId: string;
  thumbnailSrc: string;
  title: string;
  uploader: string;
  uploaderProfileImageUrl: string;
  progress: number;
  duration: number;
  views: number;
  date: string;
  videoType: 'SHORT' | 'LONG';
}
