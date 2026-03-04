import { ReactNode } from 'react';
import { ActionType } from './ShortsOnBoardingActionButtons';

interface ShortsTourFocusWrapperProps {
  type: ActionType;
  focusedAction: ActionType;
  children: ReactNode;
}

export function ShortsTourFocusWrapper({
  type,
  focusedAction,
  children,
}: ShortsTourFocusWrapperProps) {
  const isFocused = focusedAction === type;

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 ${
        isFocused
          ? 'z-50 scale-110' // 앞으로 튀어나오고 커짐
          : focusedAction
            ? 'z-30 opacity-40' // 다른 게 포커싱 중이면 어두워짐
            : 'z-30' // 평상시
      }`}
    >
      {children}
    </div>
  );
}
