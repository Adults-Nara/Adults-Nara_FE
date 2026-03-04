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
        {selectedCategories.length >= 3
          ? '완벽해요!\n다음 버튼을 눌러주세요.'
          : '선호하는 주제를\n3개 이상 선택해주세요.'}
      </p>

      <div className="flex w-full flex-col gap-5">
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
        <p className="title1 text-center">
          <span
            className={selectedCategories.length < 3 ? 'text-primary-500' : ''}
          >
            {selectedCategories.length}
          </span>{' '}
          / 5
        </p>
        <CategoryAccordion
          selectedCategories={selectedCategories}
          onToggle={(cat) => {
            if (selectedCategories.length >= 5) {
              if (!selectedCategories.includes(cat)) {
                return;
              }
            }
            onToggle(cat);
          }}
        />
        <Button
          onClick={() => {
            onComplete(selectedCategories);
          }}
          disabled={
            selectedCategories.length < 5 && selectedCategories.length < 3
          }
          className="w-full"
        >
          다음
        </Button>
      </div>
    </>
  );
};
