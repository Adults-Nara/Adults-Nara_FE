import { useState } from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { ShortsTourTab } from './ShortsTourTab';
import { ShortsExperienceTab } from './ShortsExperienceTab';

export function ShortsOnBoarding({
  onCompleteExperience,
}: {
  onCompleteExperience: (tags: string[]) => void;
}) {
  const [currentPhase, setCurrentPhase] = useState<'tour' | 'experience'>(
    'tour',
  );
  const [videoStep, setVideoStep] = useState<number>(1);

  const handleCompleteExperience = (collectedData: any) => {
    // 설정 페이지로 값 전달을 위함.
    onCompleteExperience(collectedData);
  };

  return (
    <div className="h-dvh">
      <>
        <OnboardingHeader>
          {currentPhase === 'tour' ? (
            <div />
          ) : (
            <div className="flex justify-center">
              <div className="flex h-13 w-20 flex-col items-center justify-center rounded-lg bg-black/50 text-white">
                <p className="body1">{videoStep}/6</p>
              </div>
            </div>
          )}
          <p
            className="title2 flex cursor-pointer justify-end pr-1.5 text-white drop-shadow-sm"
            onClick={() => setCurrentPhase('experience')}
          >
            건너뛰기
          </p>
        </OnboardingHeader>
        {currentPhase === 'tour' ? (
          <ShortsTourTab
            onCompleteOnboarding={() => setCurrentPhase('experience')}
          />
        ) : (
          <ShortsExperienceTab
            setVideoStep={() => setVideoStep((prev) => prev + 1)}
            onCompleteExperience={handleCompleteExperience}
          />
        )}
      </>
    </div>
  );
}
