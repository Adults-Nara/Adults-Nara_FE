'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { VirtualSwipePlayer } from '@/components/shortForm/VirtualSwipePlayer';
import { ShortFormVideoData } from '@/types/video';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import {
  ShortsOnBoardingActionButtons,
  ActionType,
} from '../ShortsOnBoardingActionButtons';
import {
  useVideoDetail,
  useVideoS3Url,
} from '@/lib/tanstack/query/video.query';
import { mapVideoDetailToShortsData } from '@/utils/videoMapper';
import { InteractionType } from '@/types/interaction';
import { toast } from '@/lib/toast';

export interface ShortsExperienceTabProps {
  onCompleteExperience: (collectedData: string[]) => void;
  setVideoStep: (videoStep: number) => void;
}

const EXPERIENCE_VIDEO_IDS: string[][] = [
  // 1. 음식 (기존 데이터 완벽)
  ['820709315068849250', '820708335296210663', '820706994075231204'],

  // 2. 드라마 및 역사 (역사 비중 강화)
  ['820709134264983627', '820708693355554934', '820709134264983627'],

  // 3. 건강
  ['820707208936841370', '820707107807979365', '820707360565125821'],

  // 4. 브이로그 (자연과 섞어 3개 구성)
  ['820708894648592724', '820708989502778104', '820707458141416052'],

  // 5. 자연 및 풍경 (자연 영상 중복 배치)
  ['820707360565125821', '820707107807979365', '820707208936841370'],

  // 6. 생활 및 투자 (투자 비중 강화)
  ['820707628123974758', '820707824035717468', '820707628123974758'],
];

interface UserAction {
  interacted: InteractionType | null;
  isBookmarked: boolean;
  isSeen: boolean;
}

const makePlaceholderVideo = (videoId: string): ShortFormVideoData => ({
  videoId,
  videoUrl: '',
  thumbnail: '',
  uploader: { name: '', profileImg: null },
  title: '',
  likes: 0,
  dislikes: 0,
  comments: 0,
  isBookmarked: false,
  longformUrl: '',
  tags: [],
  duration: 0,
});

export const ShortsExperienceTab = React.memo(
  ({ onCompleteExperience, setVideoStep }: ShortsExperienceTabProps) => {
    const [rowIndex, setRowIndex] = useState<number>(0);
    const [colIndex, setColIndex] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    // 관심사 분석용 태그 캐시 (videoId → tags)
    const [videoTagsCache, setVideoTagsCache] = useState<
      Record<string, string[]>
    >({});

    // 관심사 분석을 위한 사용자의 반응(좋아요, 싫어요, 북마크) 수집 상태
    const [userActions, setUserActions] = useState<UserAction[][]>(() =>
      EXPERIENCE_VIDEO_IDS.map((row) =>
        row.map(() => ({
          interacted: null,
          isBookmarked: false,
          isSeen: false,
        })),
      ),
    );

    const currentVideoId = EXPERIENCE_VIDEO_IDS[rowIndex][colIndex];

    const { data: detailData, isLoading: detailLoading } =
      useVideoDetail(currentVideoId);
    const { data: s3Data, isPending: s3Pending } =
      useVideoS3Url(currentVideoId);

    // 영상이 로드되면 태그를 캐시에 저장 (calcCategoryRecommend에서 사용)
    useEffect(() => {
      if (detailData && currentVideoId) {
        const tags = [
          ...(detailData.tagIds ?? []),
          ...(detailData.aiTagIds ?? []),
        ];
        setVideoTagsCache((prev) => ({ ...prev, [currentVideoId]: tags }));
      }
    }, [detailData, currentVideoId]);

    const videoLoading = detailLoading || s3Pending;

    // 지금 시청중인 영상 (API 데이터 + UserActions 합쳐서 반환)
    const currentVideo = useMemo<ShortFormVideoData>(() => {
      if (!detailData) return makePlaceholderVideo(currentVideoId);
      const mapped = mapVideoDetailToShortsData(detailData);
      const action = userActions[rowIndex][colIndex];
      return {
        ...mapped,
        videoUrl: s3Data?.masterUrl ?? '',
        interaction: action.interacted,
        isBookmarked: action.isBookmarked,
      };
    }, [detailData, s3Data, rowIndex, colIndex, userActions, currentVideoId]);

    // 썸네일 프리로드 해둘 인접 영상 (placeholder)
    const upVideo =
      rowIndex > 0
        ? makePlaceholderVideo(EXPERIENCE_VIDEO_IDS[rowIndex - 1][0])
        : null;
    const downVideo =
      rowIndex < EXPERIENCE_VIDEO_IDS.length - 1
        ? makePlaceholderVideo(EXPERIENCE_VIDEO_IDS[rowIndex + 1][0])
        : null;
    const leftVideo =
      colIndex > 0
        ? makePlaceholderVideo(EXPERIENCE_VIDEO_IDS[rowIndex][colIndex - 1])
        : null;
    const rightVideo =
      colIndex < EXPERIENCE_VIDEO_IDS[rowIndex].length - 1
        ? makePlaceholderVideo(EXPERIENCE_VIDEO_IDS[rowIndex][colIndex + 1])
        : null;

    // 스와이프 시, 현재 index 갱신 로직
    const handleSwipe = useCallback(
      (direction: 'up' | 'down' | 'left' | 'right') => {
        // 1. 다음 목적지(좌표) 계산
        let nextRow = rowIndex;
        let nextCol = colIndex;

        if (
          direction === 'down' &&
          rowIndex < EXPERIENCE_VIDEO_IDS.length - 1
        ) {
          nextRow = rowIndex + 1;
          nextCol = 0;
        } else if (direction === 'up' && rowIndex > 0) {
          nextRow = rowIndex - 1;
          nextCol = 0;
        } else if (direction === 'left' && colIndex > 0) {
          nextCol = colIndex - 1;
        } else if (
          direction === 'right' &&
          colIndex < EXPERIENCE_VIDEO_IDS[rowIndex].length - 1
        ) {
          toast.success('이 영상과 비슷한 영상을 보여드릴게요.');
          nextCol = colIndex + 1;
        }

        // 좌표가 변하지 않았다면(경계선 등) 조기 종료
        if (nextRow === rowIndex && nextCol === colIndex) return;

        // 2. 상태 반영
        setRowIndex(nextRow);
        setColIndex(nextCol);

        // 3. 시청 기록(Seen) 및 진행 단계(Step) 업데이트
        const targetAction = userActions[nextRow][nextCol];

        if (!targetAction.isSeen) {
          // 층(Row)이 아래로 내려갔을 때만 Step 증가
          if (nextRow > rowIndex) {
            setVideoStep(nextRow);
            if (nextRow === EXPERIENCE_VIDEO_IDS.length - 1) {
              setIsComplete(true);
            }
          }

          setUserActions((prev) => {
            const newActions = [...prev];
            newActions[nextRow] = [...newActions[nextRow]];
            newActions[nextRow][nextCol] = {
              ...newActions[nextRow][nextCol],
              isSeen: true,
            };
            return newActions;
          });
        }
      },
      [rowIndex, colIndex, userActions],
    );

    // 사용자 반응(좋아요, 북마크) 기록
    const handleAction = useCallback(
      (action: ActionType) => {
        setUserActions((prev) => {
          const newActions = [...prev];
          const current = prev[rowIndex][colIndex];
          let interacted = current.interacted;
          let isBookmarked = current.isBookmarked;

          if (
            action === 'LIKE' ||
            action === 'DISLIKE' ||
            action === 'SUPERLIKE'
          ) {
            if (action === interacted) {
              interacted = null;
            } else if (action === 'LIKE') {
              toast.success('앞으로 비슷한 영상을 많이 보여드릴게요!');
              interacted = 'LIKE';
            } else if (action === 'DISLIKE') {
              toast.info('앞으로 이런 영상을 조금만 보여드릴게요!');
              interacted = 'DISLIKE';
            } else {
              toast.success('앞으로 비슷한 영상을 더 많이 보여드릴게요!');
              interacted = 'SUPERLIKE';
            }
          }

          if (action === 'BOOKMARK') {
            isBookmarked = !isBookmarked;
            if (isBookmarked) {
              toast.success(
                '찜하기 목록에 추가되었어요. 나중에 영상들을 모아볼 수 있어요.',
              );
            }
          }

          newActions[rowIndex] = [...prev[rowIndex]];
          newActions[rowIndex][colIndex] = {
            ...current,
            interacted,
            isBookmarked,
            isSeen: true,
          };
          return newActions;
        });
      },
      [rowIndex, colIndex],
    );

    // 통계 결과 (캐시된 태그 기반으로 카테고리 점수 계산)
    const calcCategoryRecommend = useCallback(() => {
      const categoryScores = new Map<string, number>();

      for (let row = 0; row < userActions.length; row++) {
        for (let col = 0; col < userActions[row].length; col++) {
          const action = userActions[row][col];
          const videoId = EXPERIENCE_VIDEO_IDS[row][col];
          const tags = videoTagsCache[videoId] ?? [];

          if (action.interacted === 'LIKE') {
            tags.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 2);
            });
          } else if (action.interacted === 'DISLIKE') {
            tags.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) - 2);
            });
          } else if (action.interacted === 'SUPERLIKE') {
            tags.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 3);
            });
          }

          if (action.isBookmarked) {
            tags.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 2);
            });
          }

          if (col > 0 && action.isSeen) {
            const prevTags =
              videoTagsCache[EXPERIENCE_VIDEO_IDS[row][col - 1]] ?? [];
            prevTags.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 1);
            });
          }
        }
      }

      const sortedCategories = Array.from(categoryScores.entries()).sort(
        (a, b) => b[1] - a[1],
      );
      return sortedCategories
        .slice(0, 5)
        .filter((category) => category[1] > 0)
        .map((category) => category[0]);
    }, [userActions, videoTagsCache]);

    const handleComplete = useCallback(() => {
      const recommendedTags = calcCategoryRecommend();
      onCompleteExperience(recommendedTags);
    }, [onCompleteExperience, calcCategoryRecommend]);

    const renderController = useCallback(
      (video: ShortFormVideoData) => {
        return (
          <BaseShortFormController
            data={video}
            isReady={!videoLoading}
            actionSlot={
              <div className="flex flex-col gap-5 pb-6">
                <ShortsOnBoardingActionButtons
                  focusedAction={null}
                  onMockAction={handleAction}
                  interaction={video.interaction}
                  isBookmarked={video.isBookmarked}
                />
              </div>
            }
          />
        );
      },
      [handleAction, videoLoading],
    );

    return (
      <div className="relative h-dvh w-full bg-black">
        <div className="absolute top-20 right-4 z-50">
          <button
            onClick={handleComplete}
            className={`rounded px-4 py-2 text-white ${
              isComplete ? 'bg-primary-500' : 'bg-white/20'
            }`}
          >
            완료
          </button>
        </div>

        <VirtualSwipePlayer
          currentVideo={currentVideo}
          upVideo={upVideo}
          downVideo={downVideo}
          leftVideo={leftVideo}
          rightVideo={rightVideo}
          videoUrl={currentVideo.videoUrl ?? ''}
          videoLoading={videoLoading}
          getThumbnailUrl={(v) => v.thumbnail}
          onSwipe={handleSwipe}
          renderController={renderController}
          videoError={videoLoading}
        />
      </div>
    );
  },
);
