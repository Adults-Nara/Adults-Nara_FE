'use client';

import { useMyChildTags, useVideosByTag } from '@/lib/tanstack/query/tag.query';
import { CATEGORY_MAP } from '@/types/category';
import { useEffect, useMemo, useState } from 'react';
import CategoryTagList from './CategoryTagList';
import CategoryVedioList from './CategoryVedioList';

type CategoryItem = { label: string; value: string };

export type MyTag = {
  tagId: string;
  tagName: string;
};

export function createTagList(serverTags: MyTag[], total = 10): MyTag[] {
  // 서버 태그 id 목록
  const serverTagIds = new Set(serverTags.map((tag) => tag.tagId));

  // 전체 카테고리 펼치기
  const allCategories: CategoryItem[] = Object.values(CATEGORY_MAP).flat();

  // 서버 태그 제외
  const filtered = allCategories.filter(
    (item) => !serverTagIds.has(item.value),
  );

  // 랜덤 섞기
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  // 부족한 개수
  const needCount = total - serverTags.length;

  // 추가 태그
  const additional = shuffled.slice(0, needCount).map((item) => ({
    tagId: item.value,
    tagName: item.label,
  }));

  // 합치기
  return [...serverTags, ...additional];
}

const CategorySection = () => {
  const {
    tags,
    isError: isTagsError,
    isPending: isTagsPending,
  } = useMyChildTags();

  const resultTagList = useMemo(() => {
    if (!tags) return [];
    return createTagList(tags);
  }, [tags]);

  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    videos,
    isError: isListError,
    isPending: isListPending,
  } = useVideosByTag(Number(selectedCategory));

  useEffect(() => {
    if (resultTagList.length && !selectedCategory) {
      setSelectedCategory(resultTagList[0].tagId);
    }
  }, [resultTagList, selectedCategory]);

  return (
    <div className="flex flex-col gap-4">
      <span className="title1 pl-3">주제별 인기 영상</span>
      <CategoryTagList
        tags={resultTagList}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        isPending={isTagsPending}
        isError={isTagsError}
      />

      <CategoryVedioList
        videos={videos}
        isPending={isListPending}
        isError={isListError}
      />
    </div>
  );
};

export default CategorySection;
