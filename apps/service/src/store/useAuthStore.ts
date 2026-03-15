import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  phoneNumber: string;
  setAccessToken: (token: string | null) => void;
  setPhoneNumber: (phone: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      phoneNumber: '',
      setAccessToken: (token) => set({ accessToken: token }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ phoneNumber: state.phoneNumber }),
    },
  ),
);

export const useIsLoggedIn = () => useAuthStore((state) => !!state.accessToken);
