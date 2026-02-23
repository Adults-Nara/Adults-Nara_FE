'use client';
import { CATEGORY_MAP, MainCategory } from '@/types/category';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Chip,
} from '@repo/ui';

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
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="overflow-hidden rounded-lg border border-gray-400"
        >
          {MainCategory.map((mCat, index) => {
            const subCategories = CATEGORY_MAP[mCat.key];

            const selectedCount = subCategories.filter((sCat) =>
              selectedCategories.includes(sCat.label),
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
                <AccordionContent className="flex w-full flex-wrap items-center justify-between gap-3 px-3 py-2">
                  {CATEGORY_MAP[mCat.key].map((sCat, index) => {
                    return (
                      <Chip
                        selected={selectedCategories.includes(sCat.label)}
                        key={index}
                        size={'lg'}
                        onClick={() => onToggle(sCat.label)}
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
      </div>
    </div>
  );
};

export default PreferenceEdit;
