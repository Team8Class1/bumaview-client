import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api/auth";
import { TokenManager } from "@/lib/token-manager";
import { useAuthStore } from "@/stores/auth";
import type { JoinDto, LoginRequestDto } from "@/types/api";

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
  const { loginWithUserInfo, setHasHydrated, setToken } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequestDto) => authAPI.login(data),
    onSuccess: async (response: {
      accessToken: string;
      refreshToken?: string;
      expiresIn?: number;
    }) => {
      const token = response.accessToken;

      if (token) {
        const bareToken = token.startsWith("Bearer ") ? token.slice(7) : token;

        // Store the token immediately so subsequent API calls are authenticated
        TokenManager.setTokens(bareToken);
        setToken(bareToken);

        try {
          // Manually fetch user info using the new token
          const user = await queryClient.fetchQuery({
            queryKey: authKeys.user,
            queryFn: authAPI.getUser,
          });

          if (user) {
            loginWithUserInfo({
              token: bareToken,
              user,
            });
            setHasHydrated(true);
            router.push("/");
          } else {
            console.error("Failed to fetch user info after login.");
          }
        } catch (error) {
          console.error("Error fetching user info after login:", error);
        }
      } else {
        console.error(
          "Incomplete login response: accessToken not found in response.",
          response,
        );
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
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
export function usePasswordResetMutation() {
  return useMutation({
    mutationFn: (email: string) => authAPI.requestPasswordReset(email),
  });
}

export function useSyncUserInfo() {
  const { setUserInfo } = useAuthStore();
  const { data: userInfo } = useUser();

  // Sync user info to store when it changes
  if (userInfo && userInfo !== useAuthStore.getState().userInfo) {
    setUserInfo(userInfo);
  }

  return userInfo;
}
