export interface VideoSearchResponse {
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

export interface PageVideoSearchResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: VideoSearchResponse[];
  number: number;
  numberOfElements: number;
  empty: boolean;
  // pageable, sort 생략 혹은 필요시 확장
}
