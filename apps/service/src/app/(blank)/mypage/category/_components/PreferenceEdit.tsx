import Dropdown from '@/components/Dropdown';
import { MOCK_DATA_CATEGORY } from '@/types/category';
import { Chip } from '@repo/ui';
import { useState } from 'react';

interface PreferenceEditProps {
  selectedCategories: string[];
  onToggle: (cat: string) => void;
}

const PreferenceEdit = ({
  selectedCategories,
  onToggle,
}: PreferenceEditProps) => {
  const [dropdownMeun, setDropdownMeun] = useState(MOCK_DATA_CATEGORY[0].title);
  return (
    <div className="flex flex-col gap-4">
      <span className="title1">선호 주제 편집 </span>
      <div className="flex flex-col gap-5 px-2">
        <div className="flex w-full gap-2">
          {selectedCategories.map((cat, index) => {
            return (
              <Chip
                key={index}
                onDelete={() => {}}
                selected
                className="hover:bg-primary-500"
              >
                {cat}
              </Chip>
            );
          })}
        </div>
        {/* <Dropdown onChange={setDropdownMeun} options={MOCK_DATA_CATEGORY. } value={dropdownMeun}/> */}
      </div>
    </div>
  );
};

export default PreferenceEdit;
