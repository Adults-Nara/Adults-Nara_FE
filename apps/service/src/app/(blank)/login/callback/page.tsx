import { KakaoCallback } from '@/components/auth';
import { ROUTES } from '@/constant/routes';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const KakaoCallbackPage = async ({ searchParams }: PageProps) => {
  const { code, state } = await searchParams;
  const safeCode = Array.isArray(code) ? code[0] : (code ?? '');
  const safeState = Array.isArray(state) ? state[0] : (state ?? '');

  if (!safeCode || !safeState) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <KakaoCallback code={safeCode} state={safeState} />
    </div>
  );
};

export default KakaoCallbackPage;
