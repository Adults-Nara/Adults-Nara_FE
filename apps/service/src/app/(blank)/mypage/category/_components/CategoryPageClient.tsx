'use client';
import { useState } from 'react';
import CategoryHeader from './CategoryHeader';
import WatchTimeRanking from './WatchTimeRanking';
import PreferenceEdit from './PreferenceEdit';

//선호주제 임시 API연동필요
const categories = ['등산', '요리', '반려동물'];

const CategoryPageClient = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories ?? [],
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSave = () => {
    //선호주제 변경API 연동
    console.log(selectedCategories);
  };
  return (
    <>
      <CategoryHeader onSave={handleSave} />
      <div className="flex flex-col gap-8 px-3 py-5">
        <WatchTimeRanking
          selectedCategories={selectedCategories}
          onToggle={toggleCategory}
        />
        <PreferenceEdit
          selectedCategories={selectedCategories}
          onToggle={toggleCategory}
        />
      </div>
    </>
  );
};

export default CategoryPageClient;
