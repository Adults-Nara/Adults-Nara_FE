'use client';
import { useEffect, useState } from 'react';
import CategoryHeader from './CategoryHeader';
import WatchTimeRanking from './WatchTimeRanking';
import PreferenceEdit from './PreferenceEdit';
import { useUpdateUserTags } from '@/lib/tanstack/mutation/tag.mutation';
import { useMyChildTags } from '@/lib/tanstack/query/tag.query';
import { toast } from '@/lib/toast';
import { ChipSkeleton } from '@/components/skeleton/ChipSkeleton';
import { useRouter } from 'next/navigation';

const CategoryPageClient = () => {
  const { tags, isError, isPending } = useMyChildTags();
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { mutate } = useUpdateUserTags();

  useEffect(() => {
    if (tags) {
      setSelectedCategories(tags.map((tag) => tag.tagId));
    }
  }, [tags]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      if (selectedCategories.length >= 5) {
        toast.error('선호주제는 최대 5개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSave = () => {
    mutate(
      { tagIds: selectedCategories.map(Number) },
      {
        onSuccess: () => {
          toast.success(`선호주제 편집을 완료하였습니다.`);
          router.back();
        },
        onError: (error) => {
          toast.error(
            `선호주제 저장중에 오류가 발생하였습니다. ${error.message}`,
          );
        },
      },
    );
  };
  return (
    <>
      <CategoryHeader
        selectedCategories={selectedCategories}
        onSave={handleSave}
      />
      <div className="flex flex-col gap-8 px-3 py-5">
        <WatchTimeRanking
          selectedCategories={selectedCategories}
          onToggle={toggleCategory}
        />

        {isPending && (
          <div className="gap-2.5 overflow-hidden px-3">
            <ChipSkeleton count={3} />
          </div>
        )}
        {isError && (
          <div className="body2 text-primary-500 px-3">
            사용자 선호주제를 가져오지못했습니다.
          </div>
        )}

        {!isPending && !isError && (
          <PreferenceEdit
            selectedCategories={selectedCategories}
            onToggle={toggleCategory}
          />
        )}
      </div>
    </>
  );
};

export default CategoryPageClient;
