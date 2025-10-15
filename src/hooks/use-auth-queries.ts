import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import type { UserInfoDto } from "@/types/api";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// Queries
export const useUser = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authAPI.getUser,
    enabled: !!token,
  });
};

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { loginWithUserInfo } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Handle unknown response type from OpenAPI spec
      if (
        data &&
        typeof data === "object" &&
        "user" in data &&
        "token" in data
      ) {
        loginWithUserInfo(data as { token?: string; user: UserInfoDto });
        queryClient.setQueryData(authKeys.user(), data);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { loginWithUserInfo } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      // Handle unknown response type from OpenAPI spec
      if (
        data &&
        typeof data === "object" &&
        "user" in data &&
        "token" in data
      ) {
        loginWithUserInfo(data as { token?: string; user: UserInfoDto });
        queryClient.setQueryData(authKeys.user(), data);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // API 로그아웃이 있다면 여기서 호출
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};
