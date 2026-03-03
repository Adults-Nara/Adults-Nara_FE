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
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-2">
      <p className="title1 text-center whitespace-pre-wrap">
        앞으로 이 주제들의 영상을
        <br />더 자주 보여드릴게요.
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
      {/* 홈으로 이동 버튼 */}
      <div className="flex w-full flex-col gap-2">
        <Button onClick={onComplete}>가입 완료</Button>
        <Button onClick={onBack} className="w-full bg-gray-400">
          뒤로가기
        </Button>
      </div>
    </div>
  );
};
