import { useState } from 'react';
import { OnboardingHeader } from '../common/OnboardingHeader';
import { TagSettingOnboardingTab } from './TagSettingTab';
import { TagSettingCompleteTab } from './TagSettingCompleteTab';
import { useRouter } from 'next/navigation';

interface TagSettingOnboardingProps {
  selectedCategory: string[];
}

export function TagSettingOnboarding({
  selectedCategory,
}: TagSettingOnboardingProps) {
  const [settingStep, setSettingStep] = useState<'setting' | 'complete'>(
    'setting',
  );
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(selectedCategory);
  const onToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const onComplete = () => {
    // 가입 및 카테고리 저장 api 호출
    const router = useRouter();
    router.push('/home');
  };

  return (
    <div className="flex h-full w-full flex-col gap-20">
      <OnboardingHeader />
      <div className="flex h-full w-full flex-col items-center justify-center gap-10">
        {settingStep === 'setting' ? (
          <TagSettingOnboardingTab
            selectedCategories={selectedCategories}
            onToggle={onToggle}
            onComplete={(categories) => {
              setSelectedCategories(categories);
              setSettingStep('complete');
            }}
          />
        ) : (
          <TagSettingCompleteTab
            selectedCategories={selectedCategories}
            onBack={() => setSettingStep('setting')}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}
