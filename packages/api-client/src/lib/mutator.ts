import { useAuthStore } from "@project/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (
  setAccessToken: (token: string | null) => void,
) => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
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

export const customMutator = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const { accessToken, setAccessToken } = useAuthStore.getState();

  const reqHeaders = new Headers(options.headers);

  //body가 FormData가 아닐 때만 Content-Type을 JSON으로 설정
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !reqHeaders.has("Content-Type")
  ) {
    reqHeaders.set("Content-Type", "application/json");
  }

  if (accessToken) {
    reqHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers: reqHeaders,
  });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken(setAccessToken);

    if (newAccessToken) {
      reqHeaders.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(url, {
        ...options,
        headers: reqHeaders,
        body:
          options.body instanceof FormData
            ? options.body
            : options.body
              ? JSON.stringify(options.body)
              : undefined,
        credentials: "include",
      });
    } else {
      setAccessToken(null);
      throw new Error("AUTH_REQUIRED");
    }
  }

  // 핵심 추가: 응답이 ok가 아니면 에러를 던져서 TanStack Query가 인지하게 함
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    //TODO: 커스텀에러로 변경해야됨
    throw new Error(errorData.error?.message || "API_ERROR");
  }
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
};
