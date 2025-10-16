import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api/auth";
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
  const { login } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequestDto) => authAPI.login(data),
    onSuccess: async () => {
      try {
        // 로그인 성공 후 사용자 정보 조회
        const user = await queryClient.fetchQuery({
          queryKey: authKeys.user,
          queryFn: authAPI.getUser,
        });

        if (user) {
          login(user); // Zustand 스토어에 사용자 정보 저장

          toast({
            title: "로그인 성공",
            description: `${user.userId}님 환영합니다!`,
            variant: "success",
          });

          router.push("/");
        } else {
          // getUser가 user 정보를 반환하지 않은 경우
          throw new Error("사용자 정보를 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("로그인 후 처리 오류:", error);
        toast({
          title: "로그인 실패",
          description:
            error instanceof Error
              ? error.message
              : "사용자 정보를 가져오는 데 실패했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("로그인 API 오류:", error);
      toast({
        title: "로그인 실패",
        description: error.message || "아이디 또는 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: JoinDto) => authAPI.register(data),
    onSuccess: () => {
      toast({
        title: "회원가입 성공",
        description: "로그인 페이지로 이동합니다.",
        variant: "success",
      });
      router.push("/login");
    },
    onError: (error) => {
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입에 실패했습니다.",
        variant: "destructive",
      });
    },
  });
}

export function useLogoutMutation() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      // 백엔드에 로그아웃 API가 없으므로 클라이언트에서만 처리
      await authAPI.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast({
        title: "로그아웃",
        description: "성공적으로 로그아웃되었습니다.",
        variant: "default",
      });
      router.push("/login");
    },
  });
}

// 비밀번호 재설정 (백엔드에 API 없으므로 제거)

export function useSyncUserInfo() {
  const { setUserInfo } = useAuthStore();
  const { data: userInfo } = useUser();

  // Sync user info to store when it changes
  if (userInfo && userInfo !== useAuthStore.getState().userInfo) {
    setUserInfo(userInfo);
  }

  return userInfo;
}
