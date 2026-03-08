'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { VirtualSwipePlayer } from '@/components/shortForm/VirtualSwipePlayer';
import { ShortFormVideoData } from '@/types/video';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import {
  ShortsOnBoardingActionButtons,
  ActionType,
} from './ShortsOnBoardingActionButtons';

export interface ShortsExperienceTabProps {
  onCompleteExperience: (collectedData: string[]) => void;
  setVideoStep: (videoStep: number) => void;
}

// 임시 목업 데이터 (6개 층)
const EXPERIENCE_DATA: ShortFormVideoData[][] = [
  [
    {
      id: 'exp-1',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음식', '여행'],
    },
    {
      id: 'exp-2',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 1-1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음식', '여행'],
    },
  ],
  [
    {
      id: 'exp-3',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 2',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['반려동물', '운동'],
    },
    {
      id: 'exp-4',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 2-1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['반려동물', '운동'],
    },
  ],
  [
    {
      id: 'exp-5',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 3',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
    {
      id: 'exp-6',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 3-1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
  ],
  [
    {
      id: 'exp-5',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 4',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
    {
      id: 'exp-6',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 4-1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
  ],
  [
    {
      id: 'exp-5',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 5',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
    {
      id: 'exp-6',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 5-1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
  ],
  [
    {
      id: 'exp-7',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 6',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
    {
      id: 'exp-8',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: '',
      uploader: { name: '어른나라', profileImg: null },
      title: '관심사 파악 영상 6-1',
      likes: 0,
      dislikes: 0,
      comments: 0,
      isBookmarked: false,
      longformUrl: '',
      tags: ['음악', '건강'],
    },
  ],
];

interface UserAction {
  isLiked: boolean | null;
  isBookmarked: boolean;
  isSeen: boolean;
}

export const ShortsExperienceTab = React.memo(
  ({ onCompleteExperience, setVideoStep }: ShortsExperienceTabProps) => {
    const [rowIndex, setRowIndex] = useState<number>(0);
    const [colIndex, setColIndex] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    // 관심사 분석을 위한 사용자의 반응(좋아요, 싫어요, 북마크) 수집 상태
    const [userActions, setUserActions] = useState<UserAction[][]>(() =>
      EXPERIENCE_DATA.map((row) =>
        row.map(() => ({ isLiked: null, isBookmarked: false, isSeen: false })),
      ),
    );

    // 스와이프 시, 현재 index 갱신 로직
    const handleSwipe = useCallback(
      (direction: 'up' | 'down' | 'left' | 'right') => {
        // 1. 다음 목적지(좌표) 계산
        let nextRow = rowIndex;
        let nextCol = colIndex;

        if (direction === 'down' && rowIndex < EXPERIENCE_DATA.length - 1) {
          nextRow = rowIndex + 1;
          nextCol = 0;
        } else if (direction === 'up' && rowIndex > 0) {
          nextRow = rowIndex - 1;
          nextCol = 0;
        } else if (direction === 'left' && colIndex > 0) {
          nextCol = colIndex - 1;
        } else if (
          direction === 'right' &&
          colIndex < EXPERIENCE_DATA[rowIndex].length - 1
        ) {
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
            if (nextRow === EXPERIENCE_DATA.length - 1) {
              setIsComplete(true);
            }
          }

          setUserActions((prev) => {
            const newActions = [...prev];
            newActions[nextRow] = [...newActions[nextRow]]; // 행 복사 (불변성)
            newActions[nextRow][nextCol] = {
              ...newActions[nextRow][nextCol],
              isSeen: true,
            };
            return newActions;
          });
        }
      },
      [rowIndex, colIndex, userActions, setVideoStep],
    );

    // 사용자 반응(좋아요, 북마크) 기록
    const handleAction = useCallback(
      (action: ActionType) => {
        setUserActions((prev) => {
          const newActions = [...prev];
          const targetAction = prev[rowIndex][colIndex];
          const current = prev[rowIndex][colIndex];
          let isLiked = current.isLiked;
          let isBookmarked = current.isBookmarked;

          if (action === 'like' || action === 'dislike') {
            const changeLike = action === 'like';

            if (isLiked === null) {
              isLiked = changeLike;
            } else if (isLiked != changeLike) {
              isLiked = changeLike;
            } else {
              isLiked = null;
            }
          }

          if (action === 'bookmark') {
            isBookmarked = !isBookmarked;
          }

          newActions[rowIndex] = [...prev[rowIndex]];
          newActions[rowIndex][colIndex] = {
            ...current,
            isLiked: isLiked,
            isBookmarked: isBookmarked,
            isSeen: true,
          };
          return newActions;
        });
      },
      [rowIndex, colIndex],
    );

    const handleComplete = useCallback(() => {
      const recommendedTags = calcCategoryRecommend();
      onCompleteExperience(recommendedTags);
    }, [onCompleteExperience, userActions]);

    // 지금 시청중인 영상 (UserActions와 합쳐서 반환)
    const currentVideo = useMemo(() => {
      const baseVideo = EXPERIENCE_DATA[rowIndex][colIndex];
      const action = userActions[rowIndex][colIndex];

      return {
        ...baseVideo,
        isLiked: action.isLiked,
        isBookmarked: action.isBookmarked,
      };
    }, [rowIndex, colIndex, userActions]);

    // 썸네일 프리로드 해둘 영상
    const upVideo =
      rowIndex > 0 ? EXPERIENCE_DATA[rowIndex - 1][colIndex] : null;
    const downVideo =
      rowIndex < EXPERIENCE_DATA.length - 1
        ? EXPERIENCE_DATA[rowIndex + 1][colIndex]
        : null;
    const leftVideo =
      colIndex > 0 ? EXPERIENCE_DATA[rowIndex][colIndex - 1] : null;
    const rightVideo =
      colIndex < EXPERIENCE_DATA[rowIndex].length - 1
        ? EXPERIENCE_DATA[rowIndex][colIndex + 1]
        : null;

    const renderController = useCallback(
      (video: ShortFormVideoData) => {
        const mappedVideo = {
          videoId: video.id,
          userId: 0,
          uploaderNickname: video.uploader.name,
          uploaderProfileImageUrl: video.uploader.profileImg,
          title: video.title,
          description: '',
          thumbnailUrl: video.thumbnail,
          duration: 0,
          tags: [],
          viewCount: 0,
          likeCount: video.likes,
          uploadDate: '',
          videoType: 'SHORT' as const,
          watchProgress: 0,
          otherVideoUrl: video.longformUrl,
        };

        return (
          <BaseShortFormController
            data={mappedVideo}
            isReady={true}
            actionSlot={
              <div className="flex flex-col gap-5 pb-6">
                <ShortsOnBoardingActionButtons
                  focusedAction={null}
                  onMockAction={handleAction}
                  isLiked={video.isLiked}
                  isBookmarked={video.isBookmarked}
                />
              </div>
            }
          />
        );
      },
      [handleAction],
    );

    // 통계 결과
    const calcCategoryRecommend = () => {
      const categoryScores = new Map();

      for (let row = 0; row < userActions.length; row++) {
        for (let col = 0; col < userActions[row].length; col++) {
          const action = userActions[row][col];
          const video = EXPERIENCE_DATA[row][col];

          // 좋아요/싫어요를 누른 영상
          if (action.isLiked === true) {
            video.tags?.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 2);
            });
          } else if (action.isLiked === false) {
            video.tags?.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) - 2);
            });
          }

          //북마크를 한 영상
          if (action.isBookmarked) {
            video.tags?.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 2);
            });
          }

          if (col > 0 && action.isSeen) {
            EXPERIENCE_DATA[row][col - 1].tags?.forEach((tag) => {
              categoryScores.set(tag, (categoryScores.get(tag) || 0) + 1);
            });
          }
        }
      }

      const sortedCategories = Array.from(categoryScores.entries()).sort(
        (a, b) => b[1] - a[1],
      );
      // TODO : 이후 카테고리 정해지면, 음수 점수는 제외하고 보내기
      return sortedCategories.slice(0, 5).map((category) => category[0]);
    };

    return (
      <div className="relative h-dvh w-full bg-black">
        <div className="absolute top-20 right-4 z-50">
          <button
            onClick={() => {
              handleComplete();
            }}
            className={`rounded px-4 py-2 text-white ${isComplete ? 'bg-primary-500' : 'bg-white/20'}`}
          >
            완료
          </button>
        </div>

        <VirtualSwipePlayer<ShortFormVideoData>
          currentVideo={currentVideo}
          upVideo={upVideo}
          downVideo={downVideo}
          leftVideo={leftVideo}
          rightVideo={rightVideo}
          videoUrl={currentVideo.videoUrl}
          videoLoading={false}
          getThumbnailUrl={(v) => v.thumbnail}
          onSwipe={handleSwipe}
          renderController={(video) => renderController(video)}
        />
      </div>
    );
  },
);
