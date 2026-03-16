'use client';
import CategoryAccordion from '@/components/CategoryAccordion';
import { findLabelByValue } from '@/utils/findLabelByValue';
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
      <div className="flex items-center">
        <span className="title1">선호주제</span>
        <span className="body2 text-primary-500 ml-2">
          {selectedCategories.length}/5
        </span>
      </div>
      <div className="flex flex-col gap-5 px-2">
        <div className="flex w-full flex-wrap gap-2">
          {selectedCategories.length === 0 ? (
            <span className="body2 text-primary-400 px-1">
              선택된 주제가 없습니다! 선호주제를 선택해주세요.
            </span>
          ) : (
            selectedCategories.map((cat) => {
              return (
                <Chip
                  key={cat}
                  onDelete={() => onToggle(cat)}
                  selected
                  className="hover:bg-primary-500"
                >
                  {findLabelByValue(cat)}
                </Chip>
              );
            })
          )}
        </div>
        <div className="h-55 overflow-auto">
          <CategoryAccordion
            selectedCategories={selectedCategories}
            onToggle={onToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default PreferenceEdit;
