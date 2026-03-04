import { Logo } from '@repo/ui';

interface OnboardingHeaderProps {
  children?: React.ReactNode;
}

export function OnboardingHeader({ children }: OnboardingHeaderProps) {
  return (
    <div className="grid w-full grid-cols-3 items-center bg-transparent p-3">
      <div className="flex justify-start">
        <Logo className="h-13 w-13 text-white" />{' '}
      </div>
      {children}
    </div>
  );
}
