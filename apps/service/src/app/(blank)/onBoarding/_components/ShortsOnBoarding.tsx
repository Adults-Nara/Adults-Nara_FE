import { OnBoardingHeader } from './OnBoardingHeader';

export function ShortsOnBoarding({
  setOnboardingStep,
}: {
  setOnboardingStep: () => void;
}) {
  return (
    <>
      <OnBoardingHeader>
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
      </OnBoardingHeader>
    </>
  );
}
