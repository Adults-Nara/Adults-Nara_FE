export interface VideoData {
  videoId: string;
  videoUrl?: string;
  thumbnail: string;
  uploader: { name: string; profileImg: string | null };
  title: string;
  likes: number;
  dislikes: number;
  comments: number;
  isBookmarked: boolean;
  isLiked?: boolean | null;
  tags?: string[];
  watchProgress?: number;
  duration: number;
}

export interface LongFormVideoData extends VideoData {
  description: string;
  uploadDate: string;
  viewCount: number;
}
export interface ShortFormVideoData extends VideoData {
  longformUrl: string;
  isAd?: boolean;
}
export interface ThumbnailData {
  id: string;
  thumbnailSrc: string;
  title: string;
  uploader: string;
  duration: string;
  progress: number;
  views: number;
  date: string;
  ProfileImageUrl?: string;
  type?: 'long' | 'short';
}
