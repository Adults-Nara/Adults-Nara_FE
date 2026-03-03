import { API_ENDPOINTS } from '@/constant/endpoints';
import { useAuthStore } from '@/store/useAuthStore';

export const httpClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const { accessToken, setAccessToken } = useAuthStore.getState();
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  // const headers: Record<string, string> = {
  //   ...(options.headers as Record<string, string>),
  // };
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
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (refreshRes.ok) {
      const { accessToken: newAccessToken } = await refreshRes.json();
      setAccessToken(newAccessToken); // 메모리 갱신

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

  const data = await response.json();
  return data as T;
};
