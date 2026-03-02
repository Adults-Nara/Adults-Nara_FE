
import { OnboardingHeader } from './OnboardingHeader';
import { ShortFormVideoData } from '@/types/video';
import { ActionType, OnboardingActionButtons } from './OnboardingActionButtons';
import { OnboardingTab } from './OnboardingTab';

const mockShortData: ShortFormVideoData = {
  id: '1',
  title: 'Shorts Video Title',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnail: '',
  longformUrl: '/watch/1',
  likes: 120,
  dislikes: 5,
  comments: 20,
  isLiked: false,
  isBookmarked: false,
  uploader: {
    name: 'Mock Uploader',
    profileImg: null,
  },
};

export function ShortsOnBoarding({
  setOnboardingStep,
}: {
  setOnboardingStep: () => void;
}) {
  return (
    <div className="h-dvh">
      <OnboardingHeader>
        <div className="flex justify-center">
          <div className="flex h-13 w-20 flex-col items-center justify-center rounded-lg bg-black/50 text-white">
            <p className="body1">1/6</p>
          </div>
        </div>
        <p
          className="title2 flex justify-end text-white drop-shadow-sm"
          onClick={setOnboardingStep}
        >
          건너뛰기
        </p>
      </OnboardingHeader>
      <OnboardingTab onCompleteOnboarding={function (): void {
        throw new Error('Function not implemented.');
      } }/>
    </div>
  );
}
