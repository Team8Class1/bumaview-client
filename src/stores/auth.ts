import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "@/lib/api";

interface User {
  id: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  register: (data: api.RegisterRequest) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (id: string, password: string) => {
        const response = await api.login({ id, password });

        set({
          user: {
            id: response.id,
            email: response.email,
            role: response.role,
          },
          isAuthenticated: true,
        });
      },

      register: async (data: api.RegisterRequest) => {
        const response = await api.register(data);

        set({
          user: {
            id: response.id,
            email: response.email,
            role: response.role,
          },
          isAuthenticated: true,
        });
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
