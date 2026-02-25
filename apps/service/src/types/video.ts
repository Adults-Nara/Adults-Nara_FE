export interface VideoData {
  id: string;
  videoUrl: string;
  thumbnail: string;
  uploader: { name: string; profileImg: string | null };
  title: string;
  likes: number;
  dislikes: number;
  comments: number;
  isBookmarked: boolean;
  isLiked?: boolean | null;
}

export interface LongFormVideoData extends VideoData {
  description: string;
  uploadDate: string;
  viewCount: number;
  tags: string[];
}
export interface ShortFormVideoData extends VideoData {
  longformUrl: string;
}
export interface ThumbnailData {
  thumbnailSrc: string;
  title: string;
  uploader: string;
  duration: string;
  progress: number;
  views: number;
  date: string;
}
