'use client';

import { useState, useEffect } from 'react';
import { VirtualSwipePlayer } from '@/components/shortForm/VirtualSwipePlayer';
import { ShortFormVideoData } from '@/types/video';
import { BaseShortFormController } from '@/components/shortForm/BaseShortFormController';
import { OnboardingActionButtons, ActionType } from './OnboardingActionButtons';

export interface OnboardingTabProps {
  onCompleteOnboarding: () => void;
}

const ONBOARDING_DATA: ShortFormVideoData[] = [
  {
    id: 'ob-1',
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
    id: 'ob-2',
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
    id: 'ob-3',
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

export function OnboardingTab({ onCompleteOnboarding }: OnboardingTabProps) {
  const [tutorialStep, setTutorialStep] = useState<number>(1);

  // Step 3 (일시정지 탭) 이후 3초 뒤에 액션 버튼 설명(Step 4)으로 넘어감
  useEffect(() => {
    if (tutorialStep === 3) {
      const timer = setTimeout(() => {
        setTutorialStep(4);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tutorialStep]);

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (tutorialStep === 1) {
      if (direction === 'down') {
        setTutorialStep(2);
      }
    } else if (tutorialStep === 2) {
      if (direction === 'left' || direction === 'right') {
        setTutorialStep(3);
      }
    }
  };

  const advanceTutorial = () => {
    if (tutorialStep >= 4 && tutorialStep < 7) {
      setTutorialStep((prev) => prev + 1);
    } else if (tutorialStep === 7) {
      onCompleteOnboarding();
    }
  };

  const handlePointerUp = () => {
    // Step 3일 때 빈 화면을 터치하면 일시정지 후 조기 진행
    if (tutorialStep === 3) {
      setTimeout(() => setTutorialStep(4), 500);
    }
  };

  const handleMockAction = (action: ActionType) => {
    // 버튼 직접 클릭 시에도 다음 스텝으로 진행
    if (tutorialStep >= 4 && tutorialStep < 7) {
      setTutorialStep((prev) => prev + 1);
    } else if (tutorialStep === 7) {
      onCompleteOnboarding();
    }
  };

  const getFocusedAction = (): ActionType => {
    if (tutorialStep === 4) return 'like';
    if (tutorialStep === 5) return 'dislike';
    if (tutorialStep === 6) return 'bookmark';
    if (tutorialStep === 7) return 'comment';
    return null;
  };

  // Step 4 이후엔 마지막 영상을 계속 보여줌
  const currentVideoIndex = Math.min(tutorialStep - 1, 2);
  const currentVideo = ONBOARDING_DATA[currentVideoIndex];

  const downVideo = tutorialStep === 1 ? ONBOARDING_DATA[1] : null;
  const leftVideo = tutorialStep === 2 ? ONBOARDING_DATA[2] : null;
  const rightVideo = tutorialStep === 2 ? ONBOARDING_DATA[2] : null;

  const renderController = (video: ShortFormVideoData) => {
    return (
      <>
        <div
          className={`absolute inset-0 z-10 transition-colors duration-500 ${
            tutorialStep >= 4
              ? 'pointer-events-auto cursor-pointer bg-black/60'
              : 'pointer-events-none'
          }`}
          onClick={() => {
            if (tutorialStep >= 4) {
              advanceTutorial();
            }
          }}
        />
        <BaseShortFormController
          data={video}
          isReady={true}
          actionSlot={
            <div className="flex flex-col gap-5 pb-6">
              <OnboardingActionButtons
                focusedAction={getFocusedAction()}
                onMockAction={handleMockAction}
              />
            </div>
          }
          infoSlot={
            <div
              className={`flex flex-col gap-2 transition-opacity duration-300 ${tutorialStep >= 4 ? 'opacity-30' : 'opacity-0'}`}
            >
              <div className="h-6 w-32 animate-pulse rounded bg-gray-500" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-500" />
            </div>
          }
        />
      </>
    );
  };

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-black"
      onPointerUpCapture={handlePointerUp}
    >
      <VirtualSwipePlayer
        currentVideo={currentVideo}
        upVideo={null}
        downVideo={downVideo}
        leftVideo={leftVideo}
        rightVideo={rightVideo}
        onSwipe={handleSwipe}
        renderController={renderController}
      />

      {/* 오버레이 UI */}
      <div
        className={`pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 ${tutorialStep >= 4 ? null : 'bg-black/60'} `}
      >
        {tutorialStep === 1 && (
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            {/* 안내 텍스트 */}
            <span className="mb-4 px-4 text-center text-xl font-bold text-white shadow-black drop-shadow-md">
              관심없는 영상이라면, 위로 밀어보세요!
            </span>

            <div className="relative mt-auto h-[50vh] w-24 overflow-hidden rounded-t-full bg-white/30">
              {/* 위로 올라가는 애니메이션 */}
              <style>{`
        @keyframes swipeUp {
          0% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        .animate-swipe-up {
          animation: swipeUp 1.5s ease-in-out infinite;
        }
      `}</style>
              <div className="animate-swipe-up absolute right-0 bottom-[35vh] left-0 flex flex-col items-center">
                <div className="text-4xl text-white">👆</div>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 2 && (
          <div className="absolute inset-x-0 flex flex-col items-center">
            <span className="mb-4 px-4 text-center text-xl font-bold text-white shadow-black drop-shadow-md">
              관심있는 영상이라면, 오른쪽으로 일어보세요!
            </span>

            <div className="relative ml-auto h-28 w-80 overflow-hidden rounded-tl-[100px] rounded-bl-[100px] bg-white/30">
              <div
                className="absolute top-2 left-10 h-24 w-24 overflow-hidden"
                style={{
                  animation: 'swipeLeft 1.2s ease-in-out infinite',
                }}
              >
                {/* 애니메이션 Keyframes 정의를 위한 style 태그 */}
                <style>{`
      @keyframes swipeLeft {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-20px); }
      }
    `}</style>

                <div className="flex h-full items-center justify-center text-[40px] text-white">
                  👆
                </div>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 3 && (
          <div className="flex flex-col items-center justify-center">
            {/* 안내 텍스트 */}
            <span className="mb-12 px-4 text-center text-xl font-bold text-white shadow-black drop-shadow-md">
              화면을 터치하면 일시정지됩니다
            </span>

            {/* 애니메이션 영역 */}
            <div className="relative flex items-center justify-center">
              <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
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
    </div>
  );
}
