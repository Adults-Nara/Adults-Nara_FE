import { ShortFormVideoData } from '@/types/video';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { BookmarkListResponse } from '@/models/bookmark.model';

export const mapRecommendationToShortsData = (
  item: RecommendationVideoItem,
): ShortFormVideoData => {
  return {
    videoId: item.videoId,
    videoUrl: '', // Will be fetched via S3 url
    thumbnail: item.thumbnailUrl ?? '',
    uploader: {
      name: item.uploaderNickname ?? '알 수 없음',
      profileImg: item.uploaderProfileImageUrl ?? null,
    },
    title: item.title,
    likes: item.likeCount ?? 0,
    dislikes: 0,
    comments: 0,
    isBookmarked: false, // Default or fetch if available
    longformUrl: item.otherVideoUrl ?? '',
    watchProgress: item.watchProgress ?? 0,
    tags: item.tags ?? [],
  };
};

export const mapBookmarkToShortsData = (
  item: BookmarkListResponse,
): ShortFormVideoData => {
  return {
    videoId: item.videoId,
    videoUrl: '', // Will be fetched via S3 url
    thumbnail: item.thumbnailUrl ?? '',
    uploader: {
      name: item.uploaderName ?? '알 수 없음',
      profileImg: null,
    },
    title: item.title,
    likes: 0,
    dislikes: 0,
    comments: 0,
    isBookmarked: true, // It's from bookmark API
    longformUrl: '',
    watchProgress: item.watchProgressPercent ?? 0,
  };
};
