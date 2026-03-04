import { API_ENDPOINTS } from '@/constant/endpoints';
import { useAuthStore } from '@/store/useAuthStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (
  setAccessToken: (token: string | null) => void,
) => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshRes = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      if (!refreshRes.ok) return null;
      const { accessToken } = await refreshRes.json();
      return accessToken ?? null;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  const token = await refreshPromise;
  setAccessToken(token);
  return token;
};

export const httpClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const { accessToken, setAccessToken } = useAuthStore.getState();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);

  //body가 FormData가 아닐 때만 Content-Type을 JSON으로 설정
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken(setAccessToken);

    if (newAccessToken) {
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      setAccessToken(null);
      throw new Error('AUTH_REQUIRED');
    }
  }

  // 핵심 추가: 응답이 ok가 아니면 에러를 던져서 TanStack Query가 인지하게 함
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API_ERROR');
  }
  if (response.status === 204) return undefined as T;

  const data = await response.json();
  return data as T;
};
