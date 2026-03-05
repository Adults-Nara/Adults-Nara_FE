import { Button, Chip } from '@repo/ui';

export const TagSettingCompleteTab = ({
  selectedCategories,
  onBack,
  onComplete,
}: {
  selectedCategories: string[];
  onBack: () => void;
  onComplete: () => void;
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-3 flex-col justify-center gap-10">
        <p className="title1 text-center whitespace-pre-wrap">
          이 주제에 관심이 많으신 것 같아요.
        </p>
        {/* 선택한 chip 표시 */}
        <div className="flex w-full flex-wrap justify-center gap-2">
          {selectedCategories.map((cat, index) => {
            return (
              <Chip key={index} selected className="hover:bg-primary-500">
                {cat}
              </Chip>
            );
          })}
        </div>
        <p className="title1 text-center whitespace-pre-wrap">
          {selectedCategories.length >= 3
            ? '앞으로 이 주제의 영상을\n더 자주 보여드릴까요?'
            : '편집하기를 눌러\n선호 주제를 추가해주세요.'}
        </p>
      </div>

      {/* 홈으로 이동 버튼 */}
      <div className="flex w-full flex-1 flex-col gap-2">
        {selectedCategories.length >= 3 && (
          <Button onClick={onComplete}>네</Button>
        )}

        <Button
          onClick={onBack}
          className={`w-full ${selectedCategories.length >= 3 ? 'bg-gray-400' : ''}`}
        >
          편집하기
        </Button>
      </div>
    </div>
  );
};
