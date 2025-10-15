import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth";
import type { JoinDto, LoginRequestDto } from "@/types/api";

// Define login response type based on observed API behavior
interface LoginResponse {
  token?: string;
  accessToken?: string;
  userId?: string;
  id?: string;
  email?: string;
  role?: string;
  userSequenceId?: number;
  birthday?: string;
  favoriteList?: string[];
}

// Query keys
export const authKeys = {
  user: ["auth", "user"] as const,
};

// Queries
export function useUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => authAPI.getUser(),
    enabled: isAuthenticated,
  });
}

// Mutations
export function useLoginMutation() {
  const { loginWithUserInfo } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequestDto) => authAPI.login(data),
    onSuccess: (response) => {
      // The response structure might vary, adapt based on actual API response
      if (response && typeof response === "object") {
        const loginResp = response as LoginResponse;
        // Extract token if present in the response
        const token = loginResp.token || loginResp.accessToken;

        // If response contains user info directly
        if (loginResp.userId || loginResp.id) {
          loginWithUserInfo({
            token,
            user: {
              userSequenceId: loginResp.userSequenceId || 0,
              userId: loginResp.userId || loginResp.id || "",
              email: loginResp.email || "",
              role: (loginResp.role as "ADMIN" | "BASIC") || "BASIC",
              birthday: loginResp.birthday || "",
              favoriteList: loginResp.favoriteList || [],
            },
          });
        } else {
          // If we only get a token, fetch user info separately
          if (token) {
            useAuthStore.getState().setToken(token);
            queryClient.invalidateQueries({ queryKey: authKeys.user });
          }
        }
      }

      router.push("/");
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: JoinDto) => authAPI.register(data),
    onSuccess: () => {
      // After successful registration, redirect to login
      router.push("/login");
    },
  });
}

export function useLogoutMutation() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // The API doesn't have a logout endpoint, so just clear local state
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push("/login");
    },
  });
}

// Hook to sync user info from API with store
export function useSyncUserInfo() {
  const { setUserInfo } = useAuthStore();
  const { data: userInfo } = useUser();

  // Sync user info to store when it changes
  if (userInfo && userInfo !== useAuthStore.getState().userInfo) {
    setUserInfo(userInfo);
  }

  return userInfo;
}
