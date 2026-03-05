'use client';

import { useState } from 'react';
import { ShortsOnBoarding } from './_components/shorts/ShortsOnBoarding';
import { TagSettingOnboarding } from './_components/tagSetting/TagSettingOnboarding';

export default function OnBoardingPage() {
  const [step, setStep] = useState<number>(1);
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const handleCompleteShorts = (tags: string[]) => {
    setRecommendedTags(tags);
    setStep(2);
  };

  switch (step) {
    case 1:
      return <ShortsOnBoarding onCompleteExperience={handleCompleteShorts} />;
    case 2:
      // TODO : 태그 설정 페이지 구현
      return <TagSettingOnboarding selectedCategory={recommendedTags} />;
  }
}
