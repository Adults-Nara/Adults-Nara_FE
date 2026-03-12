'use client';
import { useEffect, useState } from 'react';
import CategoryHeader from './CategoryHeader';
import WatchTimeRanking from './WatchTimeRanking';
import PreferenceEdit from './PreferenceEdit';
import { useUpdateUserTags } from '@/lib/tanstack/mutation/tag.mutation';
import { useMyChildTags } from '@/lib/tanstack/query/tag.query';

const CategoryPageClient = () => {
  const { tags, isError, isPending } = useMyChildTags();

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
        //TODO: 추후 토스트메시지
        alert('카테고리는 최대 5개까지 선택할 수 있습니다.');
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
          //TODO: 추후 토스트로변경
          console.log('선호주제 수정 완료', selectedCategories);
        },
        onError: (error) => {
          //TODO: 추후 토스트로변경
          console.log(error.message);
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

        {/* TODO:추후 로딩 에러 화면구현 */}
        {isPending && <div>선호주제 로딩중...</div>}
        {isError && <div>선호주제에러 발생</div>}

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
