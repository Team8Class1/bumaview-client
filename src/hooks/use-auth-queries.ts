import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

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
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.token) {
        setAuth({
          token: data.token,
          user: {
            id: data.id,
            email: data.email,
            role: data.role,
          },
        });
        queryClient.setQueryData(authKeys.user(), data);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.token) {
        setAuth({
          token: data.token,
          user: {
            id: data.id,
            email: data.email,
            role: data.role,
          },
        });
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
