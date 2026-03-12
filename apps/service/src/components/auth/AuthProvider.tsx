'use client';

import { API_ENDPOINTS } from '@/constant/endpoints';
import { httpClient } from '@/services/httpClient';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiResponse } from '@/types/api';
import { useEffect, useState } from 'react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isInitialized, setIsInitialized] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

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

  // 초기 로딩 시 깜빡임 방지 (화이트아웃 방지를 위해 스켈레톤이나 null 리턴)
  if (!isInitialized) return null;

  return <>{children}</>;
}
