import { CATEGORY_MAP } from '@/types/category';

//카테고리 value-label 변환 함수
export const findLabelByValue = (value: string) => {
  const allSubCategories = Object.values(CATEGORY_MAP).flat();
  const category = allSubCategories.find((item) => item.value === value);
  return category ? category.label : value;
};
