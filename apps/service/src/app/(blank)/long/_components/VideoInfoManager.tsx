'use client';

import { useSearchParams } from 'next/navigation';
import { useVideoDetail } from '@/lib/tanstack/query/video.query';
import { useBookmarkStatus } from '@/lib/tanstack/query/bookmark.query';
import { useInteraction } from '@/lib/tanstack/query/interaction.query';
import { VideoInfo } from './VideoInfo';
import { VideoInfoSkeleton } from './VideoInfoSkeleton';
import { VideoDescription } from './VideoDescription';

export function VideoInfoManager() {
  const searchParams = useSearchParams();
  const videoIdStr = searchParams.get('v');

  // 병렬로 API 3개 호출 (숫자형 videoId만 유효할 때)
  const { data: detailData, isLoading: isDetailLoading } = useVideoDetail(
    videoIdStr || undefined,
  );

  const { data: bookmarkData, isLoading: isBookmarkLoading } =
    useBookmarkStatus(videoIdStr || undefined);

  // useInteraction은 string 형태의 ID를 받도록 구현되어 있으므로 문자열 전달
  const { data: interactionData, isLoading: isInteractionLoading } =
    useInteraction(videoIdStr as string);

  // 하나라도 로딩 중이거나 데이터를 아직 못 받아왔다면 스켈레톤(뼈대) UI 노출
  const isAnyLoading =
    isDetailLoading || isBookmarkLoading || isInteractionLoading;

  if (isAnyLoading || !detailData) {
    return <VideoInfoSkeleton />;
  }

  // 백엔드에서 내려주는 데이터와 UI 스펙 맞추기 (없다면 0으로 기본값)
  const isBookmarked = bookmarkData?.isBookmarked ?? false;
  const isLiked =
    interactionData?.interactionType === 'LIKE'
      ? true
      : interactionData?.interactionType === 'DISLIKE'
        ? false
        : null;

  if (videoIdStr === null) {
    return <VideoInfoSkeleton />;
  }
  return (
    <div className="flex flex-col gap-4">
      <VideoInfo
        videoId={videoIdStr}
        title={detailData.title}
        // TODO: 백엔드 API 업데이트 후 실제 값 매핑 (현재 VideoDetailResponse에 없음)
        viewCount={detailData.viewCount}
        comments={detailData.commentCount}
        uploadDate={detailData.createdAt}
        uploader={{
          name: detailData.userNickname,
          profileImg: detailData.userProfile,
        }}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
      />
      <div className="px-4 pb-4">
        <VideoDescription
          aiSummary={detailData.summary}
          description={detailData.description}
          tags={detailData.tagIds}
        />
      </div>
    </div>
  );
}
