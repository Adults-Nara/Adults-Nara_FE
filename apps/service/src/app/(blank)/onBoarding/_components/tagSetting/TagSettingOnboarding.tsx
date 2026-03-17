import { useState } from 'react';
import { OnboardingHeader } from '../common/OnboardingHeader';
import { TagSettingOnboardingTab } from './TagSettingTab';
import { TagSettingCompleteTab } from './TagSettingCompleteTab';
import { useRouter } from 'next/navigation';
import { useUpdateUserTags } from '@/lib/tanstack/mutation/tag.mutation';
import { useOnBoardingComplete } from '@/lib/tanstack/mutation/auth.mutation';
import { toast } from '@/lib/toast';

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
  const { mutateAsync: tagUpdateMutate } = useUpdateUserTags();
  const { mutateAsync: completeMutate } = useOnBoardingComplete();

  const onComplete = async () => {
    // 가입 및 카테고리 저장 api 호출
    try {
      await tagUpdateMutate({
        tagIds: selectedCategories.map((cat) => Number(cat)),
      });
      await completeMutate();
      router.replace('/home');
    } catch (e) {
      toast.error('온보딩 처리 중 오류가 발생하였습니다.');
    }
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
