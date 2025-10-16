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
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  userInfo: AuthUser | null;
  setHasHydrated: (state: boolean) => void;
  login: (user: AuthUser) => void;
  setUserInfo: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      userInfo: null,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      login: (data) => {
        set({
          userInfo: data,
          isAuthenticated: true,
          // Also set legacy user format for backward compatibility
          user: {
            id: data.userId,
            email: data.email,
            role: data.role?.toLowerCase(), // 백엔드에서 ADMIN으로 와도 admin으로 저장
          },
        });
      },

      setUserInfo: (userInfo) =>
        set({
          userInfo,
          isAuthenticated: !!userInfo,
          // Also update legacy user format
          user: userInfo
            ? {
                id: userInfo.userId,
                email: userInfo.email,
                role: userInfo.role?.toLowerCase(), // 백엔드에서 ADMIN으로 와도 admin으로 저장
              }
            : null,
        }),

      logout: () => {
        set({
          user: null,
          userInfo: null,
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
