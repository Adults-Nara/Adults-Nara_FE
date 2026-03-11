'use client';

import { useCallback, useMemo, useState } from 'react';
import { VirtualSwipePlayer } from '@/components/shortForm/VirtualSwipePlayer';
import { ShortFormVideoData } from '@/types/video';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import {
  ShortsOnBoardingActionButtons,
  ActionType,
} from './ShortsOnBoardingActionButtons';
import React from 'react';

export interface ShortsTourTabProps {
  onCompleteOnboarding: () => void;
}

const ONBOARDING_DATA: ShortFormVideoData[] = [
  {
    videoId: 'ob-1',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: '',
    uploader: { name: '어른나라', profileImg: null },
    title: '온보딩 첫번째 영상',
    likes: 0,
    dislikes: 0,
    comments: 0,
    isBookmarked: false,
    longformUrl: '',
  },
  {
    videoId: 'ob-2',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: '',
    uploader: { name: '어른나라', profileImg: null },
    title: '온보딩 두번째 영상',
    likes: 0,
    dislikes: 0,
    comments: 0,
    isBookmarked: false,
    longformUrl: '',
  },
  {
    videoId: 'ob-3',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: '',
    uploader: { name: '어른나라', profileImg: null },
    title: '온보딩 세번째 영상',
    likes: 0,
    dislikes: 0,
    comments: 0,
    isBookmarked: false,
    longformUrl: '',
  },
];

export const ShortsTourTab = React.memo(
  ({ onCompleteOnboarding }: ShortsTourTabProps) => {
    const [tutorialStep, setTutorialStep] = useState<number>(1);

    // 스와이프 핸들러 최적화
    const handleSwipe = useCallback(
      (direction: 'up' | 'down' | 'left' | 'right') => {
        setTutorialStep((prev) => {
          if (prev === 1 && direction === 'down') return 2;
          if (prev === 2 && (direction === 'left' || direction === 'right'))
            return 3;
          return prev;
        });
      },
      [],
    );

    const advanceTutorial = useCallback(() => {
      setTutorialStep((prev) => {
        if (prev >= 4 && prev < 7) return prev + 1;
        if (prev >= 7) {
          onCompleteOnboarding();
          console.log(prev);
          return prev;
        }
        return prev;
      });
    }, [onCompleteOnboarding]);

    const handlePointerUp = useCallback(() => {
      if (tutorialStep === 3) {
        setTimeout(() => {
          setTutorialStep(4);
        }, 200); // 터치 후 약간의 딜레이를 주어 자연스럽게 전환
      }
    }, [tutorialStep]);

    const handleMockAction = useCallback(() => {
      advanceTutorial();
    }, [advanceTutorial]);

    // 현재 포커스된 액션 타입 계산 (memoized)
    const focusedAction = useMemo((): ActionType | null => {
      const steps: Record<number, ActionType> = {
        4: 'like',
        5: 'dislike',
        6: 'bookmark',
        7: 'comment',
      };
      return steps[tutorialStep] || null;
    }, [tutorialStep]);

    // 비디오 데이터 계산 (memoized)
    const currentVideo = useMemo(
      () => ONBOARDING_DATA[Math.min(tutorialStep - 1, 2)],
      [tutorialStep],
    );

    // 컨트롤러 렌더링 함수 최적화
    const renderController = useCallback(
      (video: ShortFormVideoData) => {
        const isInteractive = tutorialStep >= 4;

        // BaseShortFormController expects RecommendationVideoItem-like structures for the title/uploader.
        // In the next step we will generalize BaseShortFormController too, but for now we map it.
        const mappedVideo: ShortFormVideoData = {
          videoId: String(video.videoId),
          uploader: {
            name: video.uploader.name,
            profileImg: video.uploader.profileImg,
          },
          title: video.title,

          thumbnail: video.thumbnail,

          tags: [],

          likes: video.likes,
          dislikes: video.dislikes,
          comments: video.comments,
          isBookmarked: video.isBookmarked,
          isLiked: video.isLiked,

          watchProgress: 0,
          longformUrl: '',
          videoUrl: '',
        };

        return (
          <>
            <div
              className={`absolute inset-0 z-20 transition-colors duration-500 ${
                isInteractive
                  ? 'pointer-events-auto cursor-pointer bg-black/60'
                  : 'pointer-events-none'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isInteractive) advanceTutorial();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            />
            <BaseShortFormController
              data={mappedVideo}
              isReady={true}
              actionSlot={
                <div className="flex flex-col gap-5 pb-6">
                  <ShortsOnBoardingActionButtons
                    focusedAction={focusedAction}
                    onMockAction={handleMockAction}
                  />
                </div>
              }
            />
          </>
        );
      },
      [tutorialStep, advanceTutorial, focusedAction, handleMockAction],
    );

    return (
      <div
        className="relative h-dvh w-full overflow-hidden bg-black"
        onPointerUpCapture={handlePointerUp}
      >
        <VirtualSwipePlayer
          currentVideo={currentVideo}
          upVideo={null}
          downVideo={tutorialStep === 1 ? ONBOARDING_DATA[1] : null}
          leftVideo={tutorialStep === 2 ? ONBOARDING_DATA[2] : null}
          rightVideo={tutorialStep === 2 ? ONBOARDING_DATA[2] : null}
          videoUrl={currentVideo.videoUrl}
          videoLoading={false}
          getThumbnailUrl={(v) => v.thumbnail}
          onSwipe={handleSwipe}
          renderController={renderController}
        />

        {/* 오버레이 UI 레이어 */}
        <div
          className={`pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 ${tutorialStep >= 4 ? '' : 'bg-black/60'}`}
        >
          {tutorialStep === 1 && (
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
              <span className="mb-4 px-4 text-center text-xl font-bold text-white shadow-black drop-shadow-md">
                관심없는 영상이라면,
                <br /> 위로 밀어보세요!
              </span>
              <div className="relative mt-auto h-[50vh] w-28 overflow-hidden rounded-t-full bg-white/30">
                <div className="animate-swipe-up absolute right-0 bottom-[35vh] left-0 flex flex-col items-center">
                  <div className="text-4xl text-white">👆</div>
                </div>
              </div>
            </div>
          )}

          {tutorialStep === 2 && (
            <div className="absolute inset-x-0 flex flex-col items-center">
              <span className="mb-4 px-4 text-center text-xl font-bold text-white shadow-black drop-shadow-md">
                관심있는 영상이라면,
                <br /> 왼쪽으로 밀어보세요!
              </span>
              <div className="relative ml-auto h-28 w-80 overflow-hidden rounded-tl-[100px] rounded-bl-[100px] bg-white/30">
                <div className="animate-swipe-left absolute top-2 left-10 flex h-24 w-24 items-center justify-center text-[40px] text-white">
                  👆
                </div>
              </div>
            </div>
          )}

          {tutorialStep === 3 && (
            <div className="flex flex-col items-center justify-center">
              <span className="mb-12 px-4 text-center text-xl font-bold text-white shadow-black drop-shadow-md">
                화면을 터치하면 일시정지됩니다
              </span>
              <div className="relative flex items-center justify-center">
                <div className="animate-ripple absolute h-20 w-20 rounded-full bg-white/40" />
                <div
                  className="animate-ripple absolute h-20 w-20 rounded-full bg-white/20"
                  style={{ animationDelay: '0.7s' }}
                />
                <div className="relative text-6xl text-white drop-shadow-lg">
                  👆
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
        @keyframes swipeUp {
          0% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        @keyframes swipeLeft {
          0% { transform: translateX(0); opacity: 0.3; }
          50% { transform: translateX(-20px); opacity: 1; }
          100% { transform: translateX(-40px); opacity: 0; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-swipe-up { animation: swipeUp 1.5s ease-in-out infinite; }
        .animate-swipe-left { animation: swipeLeft 1.2s ease-in-out infinite; }
        .animate-ripple { animation: ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
      </div>
    );
  },
);
