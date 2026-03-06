export interface BookmarkListResponse {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  uploaderName: string;
  watchProgressPercent: number;
  duration: number;
  uploadDate: string;
}

export interface BookmarkPageResponse {
  items: BookmarkListResponse[];
  hasMore: boolean;
}

export interface BookmarkStatusResponseDto {
  isBookmarked: boolean;
}

export interface BookmarkPlaylistResponse {
  totalCount: number;
  thumbnails: string[];
}

export interface BookmarkSummaryResponse {
  shortForm: BookmarkPlaylistResponse;
  longForm: BookmarkPlaylistResponse;
}
