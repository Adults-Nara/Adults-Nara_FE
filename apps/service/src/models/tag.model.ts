export interface ChildTagResponse {
  tagId: string;
  tagName: string;
}

export interface ParentTagWithChildResponse {
  tagId: string;
  tagName: string;
  childTagList: ChildTagResponse[];
}

export interface TagVideoResponse {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  uploaderName: string;
  watchProgressPercent: number;
  uploadedAt: string;
  duration: number;
}

export interface TagWatchStatsResponse {
  tagId: string;
  tagName: string;
  totalWatchSeconds: number;
}

export interface UpdateUserTagRequest {
  tagIds: number[];
}

export interface OnboardingTagRequest {
  tagIds: number[]; // 정확히 5개
}

export interface TagScoreDto {
  tagName: string;
  score: number;
}

export interface MonthlyStatsResponseDto {
  statsYear: number;
  statsMonth: number;
  tagWatchStats: TagWatchStatDto[];
  navigation: NavigationDto;
}

export interface TagWatchStatDto {
  tagId: string;
  tagName: string;
  totalWatchSeconds: number;
}

export interface NavigationDto {
  prevYear: number;
  prevMonth: number;
  nextYear: number;
  nextMonth: number;
  hasPrev: boolean;
  hasNext: boolean;
}
