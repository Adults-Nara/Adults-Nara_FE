'use client';

import { API_ENDPOINTS } from '@/constant/endpoints';
import { ROUTES } from '@/constant/routes';
import { useMyChildTags } from '@/lib/tanstack/query/tag.query';
import { httpClient } from '@/services/httpClient';
import { useAuthStore, useIsLoggedIn } from '@/store/useAuthStore';
import { ApiResponse } from '@/types/api';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isInitialized, setIsInitialized] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useIsLoggedIn();
  const pathname = usePathname();
  const router = useRouter();

  const { tags, isPending } = useMyChildTags();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 이미 토큰이 있으면(페이지 이동 등) 패스
        if (useAuthStore.getState().accessToken) return;

        const response = await httpClient<ApiResponse<{ accessToken: string }>>(
          API_ENDPOINTS.AUTH.REFRESH,
          {
            method: 'POST',
            credentials: 'include',
          },
        );
        const accessToken = response.data.accessToken;

        if (accessToken) {
          setAccessToken(accessToken);
        } else {
          console.error('엑세스토큰 없음');
        }
      } catch (e) {
      } finally {
        setIsInitialized(true);
      }
    };
    initAuth();
  }, [setAccessToken]);

  useEffect(() => {
    if (!isInitialized || isPending) return;

    // 온보딩 체크가 필요 없는 경로 리스트
    const excludedPaths = [ROUTES.ONBOARDING, ROUTES.LOGIN];
    const isExcluded = excludedPaths.some((path) => pathname === path);

    // 로그인 된 유저인데 설정한 태그가 0개라면 온보딩으로 이동
    if (isLoggedIn && tags.length === 0 && !isExcluded) {
      // router.replace(ROUTES.ONBOARDING);
    }
  }, [isInitialized, isPending, isLoggedIn, tags, pathname, router]);

  // 초기 로딩 시 깜빡임 방지 (화이트아웃 방지를 위해 스켈레톤이나 null 리턴)
  if (!isInitialized) return null;

  return <>{children}</>;
}
