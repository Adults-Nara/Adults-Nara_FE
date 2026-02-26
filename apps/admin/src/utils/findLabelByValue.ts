import { CATEGORY_MAP } from '@/types/category';

const findLabelByValue = (value: string) => {
  const allSubCategories = Object.values(CATEGORY_MAP).flat();
  const category = allSubCategories.find((item) => item.value === value);
  return category ? category.label : value;
};

export default findLabelByValue;
