import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import {
  AuthErrorType,
  classifyError,
  isRetryableError,
} from "@/lib/error-handling";
import { useAuthStore } from "@/stores/auth";
import type { UserInfoDto } from "@/types/api";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  checkId: (id: string) => [...authKeys.all, "checkId", id] as const,
  checkEmail: (email: string) =>
    [...authKeys.all, "checkEmail", email] as const,
};

// Queries
export const useUser = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authAPI.getUser,
    enabled: !!token,
    retry: (failureCount, error) => {
      const { type } = classifyError(error);
      // 토큰 만료나 인증 오류는 재시도하지 않음
      if (
        type === AuthErrorType.TOKEN_EXPIRED ||
        type === AuthErrorType.UNAUTHORIZED
      ) {
        return false;
      }
      return isRetryableError(type) && failureCount < 2;
    },
  });
};

// Enhanced Login Hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { loginWithUserInfo, setHasHydrated } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.login,
    retry: (failureCount, error) => {
      const { type } = classifyError(error);
      return isRetryableError(type) && failureCount < 2;
    },
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
        
        // Hydration 상태 업데이트
        setHasHydrated(true);

        // 성공적인 로그인 후 검증 캐시 초기화
        queryClient.removeQueries({ queryKey: authKeys.all });
      }
    },
    onError: (error) => {
      const { type } = classifyError(error);

      // 로그인 실패시 특정 에러 타입에 따른 추가 처리
      if (type === AuthErrorType.RATE_LIMITED) {
        // Rate limit 에러시 더 긴 재시도 지연
        setTimeout(() => {
          // 필요시 추가 로직
        }, 60000);
      }
    },
  });
};

// Enhanced Register Hook
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { loginWithUserInfo } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.register,
    retry: (failureCount, error) => {
      const { type } = classifyError(error);
      // 중복 에러나 검증 에러는 재시도하지 않음
      if (
        type === AuthErrorType.EMAIL_ALREADY_EXISTS ||
        type === AuthErrorType.ID_ALREADY_EXISTS ||
        type === AuthErrorType.VALIDATION_ERROR
      ) {
        return false;
      }
      return isRetryableError(type) && failureCount < 2;
    },
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

        // 성공적인 회원가입 후 검증 캐시 초기화
        queryClient.removeQueries({ queryKey: authKeys.all });
      }
    },
  });
};

// Enhanced Logout Hook
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
    onError: () => {
      // 로그아웃 실패시에도 로컬 상태는 초기화
      logout();
      queryClient.clear();
    },
  });
};

// Password Reset Hook
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: authAPI.requestPasswordReset,
    retry: (failureCount, error) => {
      const { type } = classifyError(error);
      return isRetryableError(type) && failureCount < 2;
    },
  });
};

// Change Password Hook
export const useChangePassword = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.changePassword,
    retry: (failureCount, error) => {
      const { type } = classifyError(error);
      return isRetryableError(type) && failureCount < 2;
    },
    onSuccess: () => {
      // 비밀번호 변경 후 보안을 위해 로그아웃
      logout();
      queryClient.clear();
    },
  });
};
