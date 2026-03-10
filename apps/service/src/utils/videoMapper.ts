import { ShortFormVideoData } from '@/types/video';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { BookmarkListResponse } from '@/models/bookmark.model';

export const mapRecommendationToShortsData = (
  item: RecommendationVideoItem,
): ShortFormVideoData => {
  return {
    videoId: item.videoId,
    videoUrl: '', // Will be fetched via S3 url
    thumbnail: item.thumbnailSrc ?? '',
    uploader: {
      name: item.uploader ?? '알 수 없음',
      profileImg: item.uploaderProfileImageUrl ?? null,
    },
    title: item.title,
    likes: 0, // No longer provided in vertical feed
    dislikes: 0,
    comments: 0,
    isBookmarked: false, // Default or fetch if available
    longformUrl: '', // No longer provided in vertical feed
    watchProgress: item.progress ?? 0,
    tags: [], // No longer provided in vertical feed
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
