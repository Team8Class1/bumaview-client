import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTokenExpiry, TokenManager } from "@/lib/token-manager";
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
  _hasHydrated: boolean;
  // New methods for OpenAPI spec
  userInfo: AuthUser | null;
  setHasHydrated: (state: boolean) => void;
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
      _hasHydrated: false,
      userInfo: null,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      login: (data) => {
        // 토큰을 TokenManager로 관리
        if (data.token) {
          const expiry = getTokenExpiry(data.token);
          TokenManager.setTokens(
            data.token,
            undefined,
            expiry ? Math.floor((expiry - Date.now()) / 1000) : undefined,
          );
        }

        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },

      loginWithUserInfo: (data) => {
        // 토큰을 TokenManager로 관리
        if (data.token) {
          const expiry = getTokenExpiry(data.token);
          TokenManager.setTokens(
            data.token,
            undefined,
            expiry ? Math.floor((expiry - Date.now()) / 1000) : undefined,
          );
        }

        const userData = {
          id: data.user.userId,
          email: data.user.email,
          role: data.user.role,
        };

        console.log("loginWithUserInfo called:", { data, userData });

        set({
          userInfo: data.user,
          token: data.token || null,
          isAuthenticated: true,
          // Also set legacy user format for backward compatibility
          user: userData,
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

      logout: () => {
        // 토큰 매니저에서도 토큰 삭제
        TokenManager.clearTokens();

        set({
          user: null,
          userInfo: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useAuth = useAuthStore;
