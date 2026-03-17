import { CATEGORY_MAP, MainCategory } from '@/types/category';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Chip,
} from '@repo/ui';

interface CategoryAccordionProps {
  selectedCategories: string[];
  onToggle: (cat: string) => void;
}

const CategoryAccordion = ({
  selectedCategories,
  onToggle,
}: CategoryAccordionProps) => {
  return (
    <Accordion type="multiple" className="rounded-lg border border-gray-400">
      {MainCategory.map((mCat, index) => {
        const subCategories = CATEGORY_MAP[mCat.key];

        const selectedCount = subCategories.filter((sCat) =>
          selectedCategories.includes(sCat.value),
        ).length;
        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              {mCat.label}
              {selectedCount > 0 && (
                <div className="body2 ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white">
                  {selectedCount}
                </div>
              )}
            </AccordionTrigger>
            <AccordionContent className="flex w-full flex-wrap items-center gap-3 px-3 py-2">
              {CATEGORY_MAP[mCat.key].map((sCat, index) => {
                return (
                  <Chip
                    selected={selectedCategories.includes(sCat.value)}
                    key={index}
                    size={'lg'}
                    onClick={() => onToggle(sCat.value)}
                  >
                    {sCat.label}
                  </Chip>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAccordion;
