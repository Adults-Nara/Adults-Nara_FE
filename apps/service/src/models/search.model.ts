export interface VideoSearchResponse {
  videoId: number;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  duration: number;
  createdAt: string;
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
