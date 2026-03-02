'use client';

import { useState } from 'react';
import { ShortsOnBoarding } from './_components/ShortsOnBoarding';

export default function OnBoardingPage() {
  const stepTitle = {
    1: '사용법 및 내 취향 찾기',
    2: '내 선호 태그 설정',
  };
  const [step, setStep] = useState<number>(1);

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  switch (step) {
    case 1:
      return <ShortsOnBoarding setOnboardingStep={nextStep} />;
    case 2:
      return <></>;
  }
}
