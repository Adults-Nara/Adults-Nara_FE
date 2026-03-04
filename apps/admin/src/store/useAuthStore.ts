import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  role: 'UPLOADER' | 'ADMIN' | null;
  setAccessToken: (
    token: string | null,
    role: 'UPLOADER' | 'ADMIN' | null,
  ) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  setAccessToken: (token, role) => set({ accessToken: token, role }),
}));

export const useIsLoggedIn = () => useAuthStore((state) => !!state.accessToken);
