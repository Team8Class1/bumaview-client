import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfoDto } from "@/types/api";

interface User {
  id: string;
  email?: string;
  role?: string;
}

// Enhanced user interface based on OpenAPI spec
interface AuthUser extends UserInfoDto {
  // Additional frontend-specific properties if needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // New methods for OpenAPI spec
  userInfo: AuthUser | null;
  login: (data: { token: string; user: User }) => void;
  loginWithUserInfo: (data: { token?: string; user: AuthUser }) => void;
  setUser: (user: User | null) => void;
  setUserInfo: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      userInfo: null,

      login: (data) => {
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },

      loginWithUserInfo: (data) => {
        set({
          userInfo: data.user,
          token: data.token || null,
          isAuthenticated: true,
          // Also set legacy user format for backward compatibility
          user: {
            id: data.user.userId,
            email: data.user.email,
            role: data.user.role,
          },
        });
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setUserInfo: (userInfo) =>
        set({
          userInfo,
          isAuthenticated: !!userInfo,
          // Also update legacy user format
          user: userInfo
            ? {
                id: userInfo.userId,
                email: userInfo.email,
                role: userInfo.role,
              }
            : null,
        }),

      setToken: (token) =>
        set({
          token,
        }),

      logout: () =>
        set({
          user: null,
          userInfo: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useAuth = useAuthStore;
