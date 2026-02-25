'use client';
import CategoryAccordion from '@/components/CategoryAccordion';
import { Chip } from '@repo/ui';

interface PreferenceEditProps {
  selectedCategories: string[];
  onToggle: (cat: string) => void;
}

const PreferenceEdit = ({
  selectedCategories,
  onToggle,
}: PreferenceEditProps) => {
  return (
    <div className="flex flex-col gap-4">
      <span className="title1">선호주제</span>

      <div className="flex flex-col gap-5 px-2">
        <div className="flex w-full flex-wrap gap-2">
          {selectedCategories.length === 0 ? (
            <span className="body2 text-primary-400 px-1">
              선택된 주제가 없습니다! 선호주제를 선택해주세요.
            </span>
          ) : (
            selectedCategories.map((cat, index) => {
              return (
                <Chip
                  key={index}
                  onDelete={() => onToggle(cat)}
                  selected
                  className="hover:bg-primary-500"
                >
                  {cat}
                </Chip>
              );
            })
          )}
        </div>
        <CategoryAccordion
          selectedCategories={selectedCategories}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
};

export default PreferenceEdit;
