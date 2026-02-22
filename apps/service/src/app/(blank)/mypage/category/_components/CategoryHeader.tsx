'use client';
import { Button, Check, LeftArrow } from '@repo/ui';
import { useRouter } from 'next/navigation';

interface CategoryHeaderProps {
  onSave: () => void;
}

const CategoryHeader = ({ onSave }: CategoryHeaderProps) => {
  const route = useRouter();
  return (
    <div className="sticky top-0 z-40 flex h-17.5 items-center justify-between border-b border-gray-300 bg-gray-100 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={route.back}
          aria-label="뒤로가기"
          className="cursor-pointer"
        >
          <LeftArrow className="h-6 w-6.5" />
        </button>
        <span className="title2">선호주제 편집</span>
      </div>
      <Button onClick={onSave} size={'lg'} variant={'default'}>
        <Check />
        저장
      </Button>
    </div>
  );
};

export default CategoryHeader;
