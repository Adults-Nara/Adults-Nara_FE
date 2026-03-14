import { CategoryAccordion } from '@/components/common';
import findLabelByValue from '@/utils/findLabelByValue';
import { Chip } from '@repo/ui';
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { UploadRequest } from '@/models/content.model';

const ContentCategorySection = () => {
  const { control, setValue } = useFormContext<UploadRequest>();

  const { errors } = useFormState({
    control,
  });
  const selectedCategories = useWatch({
    control,
    name: 'tagIds',
  });

  const handleToggleCategory = (
    category: string,
    currentValues: string[],
    onChange: (val: string[]) => void,
  ) => {
    if (currentValues.includes(category)) {
      onChange(currentValues.filter((c) => c !== category));
    } else {
      if (currentValues.length >= 3) {
        alert('카테고리는 최대 3개까지 선택할 수 있습니다.');
        return;
      }
      onChange([...currentValues, category]);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 px-1">
      <span className="body2 text-gray-900">
        카테고리 선택
        <span className="body2 text-primary-500 ml-2">
          {selectedCategories.length}/3
        </span>
      </span>

      <div className="flex min-h-10 w-full flex-wrap gap-2">
        {selectedCategories.length === 0 ? (
          <span className="body2 text-primary-400 px-1 italic">
            선택된 카테고리가 없습니다!
          </span>
        ) : (
          selectedCategories.map((cat: string) => (
            <Chip
              key={cat}
              selected
              onDelete={() =>
                setValue(
                  'tagIds',
                  selectedCategories.filter((c: string) => c !== cat),
                )
              }
              className="hover:bg-primary-600"
            >
              {findLabelByValue(cat)}
            </Chip>
          ))
        )}
      </div>
      <div className="h-69">
        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <CategoryAccordion
              selectedCategories={field.value}
              onToggle={(val) =>
                handleToggleCategory(val, field.value, field.onChange)
              }
            />
          )}
        />
        {errors.tagIds && (
          <p className="body3 mt-1 text-red-500">{errors.tagIds.message}</p>
        )}
      </div>
    </div>
  );
};

export default ContentCategorySection;
