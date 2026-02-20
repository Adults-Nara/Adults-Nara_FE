'use client';
import { useState } from 'react';
import CategoryHeader from './CategoryHeader';

//임시 API연동필요
const MOCK_DATA_RANK = [
  {
    category: '건강',
    time: '5시간 20분',
  },
  {
    category: '요리',
    time: '3시간 40분',
  },
  {
    category: '애완동물',
    time: '2시간',
  },
  {
    category: '여행',
    time: '1시간 40분',
  },
  {
    category: '음악',
    time: '1시간 10분',
  },
  {
    category: '뉴스',
    time: '1시간',
  },
  {
    category: '교양',
    time: '50분',
  },
  {
    category: '드라마',
    time: '40분',
  },
];

const CategoryPageClient = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleSave = () => {
    //선호주제 변경API 연동
    console.log(selectedTopics);
  };
  return (
    <>
      <CategoryHeader onSave={handleSave} />
    </>
  );
};

export default CategoryPageClient;
