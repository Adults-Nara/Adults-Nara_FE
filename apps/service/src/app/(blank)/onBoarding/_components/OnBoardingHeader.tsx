import { Logo } from '@repo/ui';

interface OnBoardingHeaderProps {
  children?: React.ReactNode;
}

export function OnBoardingHeader({ children }: OnBoardingHeaderProps) {
  return (
    <div className="sticky top-0 left-0 grid w-full grid-cols-3 items-center p-3">
      <div className="flex justify-start">
        <Logo className="h-13 w-13" />
      </div>
      {children}
    </div>
  );
}
