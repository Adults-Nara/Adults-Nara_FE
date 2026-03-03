'use client';

import { useState } from 'react';
import { ShortsOnBoarding } from './_components/ShortsOnBoarding';

export default function OnBoardingPage() {
  const stepTitle = {
    1: '사용법 및 내 취향 찾기',
    2: '내 선호 태그 설정',
  };
  const [step, setStep] = useState<number>(1);
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const handleCompleteShorts = (tags: string[]) => {
    setRecommendedTags(tags);
    setStep(2);
  };
  function nextStep() {
    setStep((prev) => prev + 1);
  }

  switch (step) {
    case 1:
      return <ShortsOnBoarding onCompleteExperience={handleCompleteShorts} />;
    case 2:
      // TODO : 태그 설정 페이지 구현
      return <></>;
  }
}
