'use client';
import { ROUTES } from '@/constant/routes';
import { Chip, ImagesIcon, Input, LeftArrow, Upload } from '@repo/ui';
import Link from 'next/link';
import { CategoryAccordion } from '../common';
import { useState } from 'react';

const ContentForm = () => {
  //선호주제 임시 API연동필요
  const categories = ['등산', '요리', '반려동물'];

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

  return (
    <div className="flex w-full min-w-250 flex-col gap-5 px-9 py-5">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.CONTENT} className="cursor-pointer">
          <LeftArrow className="h-6 w-7" />
        </Link>
        <span className="title1">콘텐츠 등록</span>
      </div>

      <div className="flex w-full gap-2">
        <div className="flex h-75 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
          <span className="title2">영상 파일</span>
          <div className="body2 flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
            <Upload className="h-7 w-7" />
            클릭하여 영상 업로드
          </div>
        </div>
        <div className="flex h-75 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
          <span className="title2">썸네일</span>
          <div className="body2 flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
            <ImagesIcon className="h-6 w-6" />
            클릭하여 썸네일 업로드
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-500 bg-white px-6 py-4">
        <span className="title2">기본 정보</span>

        <div className="flex gap-3">
          <div className="flex w-full flex-col gap-3 px-2">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <span className="body2 text-gray-900">컨텐츠 유형</span>
                <div className="flex gap-2">
                  <Chip size={'lg'}>숏폼</Chip>
                  <Chip size={'lg'}>롱폼</Chip>
                  <Chip size={'lg'}>광고</Chip>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="body2 text-gray-900">컨텐츠 상태</span>
                <div>토글토글</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <span className="body2 text-gray-900">영상 연동</span>
                <Input placeholder="연동하실 롱폼 영상주소" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="body2 text-gray-900">영상 제목</span>
                <Input placeholder="영상 제목을 입력해주세요" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="body2 text-gray-900">영상 설명</span>
                <textarea className="rounded-lg border border-gray-500 bg-gray-200 focus:border-gray-900" />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 px-2">
            <span className="body2 text-gray-900">카테고리 선택</span>
            <CategoryAccordion
              selectedCategories={selectedCategories}
              onToggle={toggleCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
