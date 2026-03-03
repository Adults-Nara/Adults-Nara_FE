import CategoryAccordion from '@/components/CategoryAccordion';
import { Button, Chip } from '@repo/ui';

export const TagSettingOnboardingTab = ({
  selectedCategories,
  onToggle,
  onComplete,
}: {
  selectedCategories: string[];
  onToggle: (category: string) => void;
  onComplete: (categories: string[]) => void;
}) => {
  return (
    <>
      <p className="title1 text-center whitespace-pre-wrap">
        이 주제들에 대해 관심이
        <br />
        많으신 것 같아요.
      </p>
      <div className="flex w-full flex-col gap-5 px-2">
        <div className="flex w-full flex-wrap justify-center gap-2">
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
        <Button
          onClick={() => {
            onComplete(selectedCategories);
          }}
          disabled={selectedCategories.length < 5}
          className="w-full"
        >
          저장
        </Button>
      </div>
    </>
  );
};
