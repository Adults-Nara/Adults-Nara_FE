export interface ThumbnailData {
  thumbnailSrc: string;
  title: string;
  uploader: string;
  duration: string;
  progress: number;
  views: number;
  date: string;
  type?: 'long' | 'short';
}
