import { useState } from 'react';
import { OnboardingHeader } from '../common/OnboardingHeader';
import { TagSettingOnboardingTab } from './TagSettingTab';
import { TagSettingCompleteTab } from './TagSettingCompleteTab';
import { useRouter } from 'next/navigation';
import {
  getMyChildTags,
  saveOnboardingTags,
  updateUserTags,
} from '@/services/tag.api';
import { useUpdateUserTags } from '@/lib/tanstack/mutation/tag.mutation';

interface TagSettingOnboardingProps {
  selectedCategory: string[];
}

export function TagSettingOnboarding({
  selectedCategory,
}: TagSettingOnboardingProps) {
  const [settingStep, setSettingStep] = useState<'setting' | 'complete'>(
    selectedCategory.length === 0 ? 'setting' : 'complete',
  );
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(selectedCategory);
  const onToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };
  const router = useRouter();
  const { mutate } = useUpdateUserTags();

  const onComplete = () => {
    // 가입 및 카테고리 저장 api 호출
    mutate({
      tagIds: selectedCategories.map((cat) => Number(cat)),
    });
    router.replace('/home');
  };

  return (
    <div className="flex h-dvh w-full flex-col">
      <OnboardingHeader />
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-2">
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
