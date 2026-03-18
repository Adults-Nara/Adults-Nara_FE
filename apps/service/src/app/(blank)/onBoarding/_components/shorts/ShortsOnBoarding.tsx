import { useState } from 'react';
import { OnboardingDescPage } from './description/OnboardingDescPage';
import { OnboardingHeader } from '../common/OnboardingHeader';
import { ShortsExperienceTab } from './experience/ShortsExperienceTab';
import { ShortsTourTab } from './tour/ShortsTourTab';

export function ShortsOnBoarding({
  onCompleteExperience,
}: {
  onCompleteExperience: (tags: string[]) => void;
}) {
  const [currentPhase, setCurrentPhase] = useState<
    'tour' | 'description' | 'experience'
  >('tour');
  const [videoStep, setVideoStep] = useState<number>(1);

  const handleCompleteExperience = (collectedData: string[]) => {
    // 설정 페이지로 값 전달을 위함.
    onCompleteExperience(collectedData);
  };

  if (currentPhase === 'description') {
    return <OnboardingDescPage onNext={() => setCurrentPhase('experience')} />;
  }

  return (
    <div className="relative h-dvh">
      <>
        <div className="absolute top-0 left-0 z-50 w-full">
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
            <button
              className="title2 flex cursor-pointer justify-end border-none bg-transparent pr-1.5 text-white drop-shadow-sm"
              onClick={() => {
                if (currentPhase === 'tour') {
                  setCurrentPhase('description');
                } else {
                  handleCompleteExperience([]);
                }
              }}
            >
              건너뛰기
            </button>
          </OnboardingHeader>
        </div>
        {currentPhase === 'tour' ? (
          <ShortsTourTab
            onCompleteOnboarding={() => setCurrentPhase('description')}
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
