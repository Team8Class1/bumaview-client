import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "admin",
        email: "admin@bumaview.com",
        role: "admin",
      },
      isAuthenticated: true,

      login: async (id: string, _password: string) => {
        try {
          // TODO: API 호출 구현
          // const response = await fetch('/api/user/login', {
          //   method: 'GET',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ id, password })
          // });

          // 임시로 성공한 것으로 처리
          const mockUser: User = {
            id,
            email: `${id}@example.com`,
            role: "basic",
          };

          set({
            user: mockUser,
            isAuthenticated: true,
          });
        } catch (_error) {
          throw new Error("Login failed");
        }
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useAuth = useAuthStore;
