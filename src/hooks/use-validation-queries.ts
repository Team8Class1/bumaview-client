import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

// 아이디 중복 검사
export const useCheckIdAvailable = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["checkId", id],
    queryFn: () => authAPI.checkIdAvailable(id),
    enabled: enabled && id.length >= 4, // 4자 이상일 때만 검사
    staleTime: 30000, // 30초간 캐시
    retry: 1,
  });
};

// 이메일 중복 검사
export const useCheckEmailAvailable = (email: string, enabled = true) => {
  return useQuery({
    queryKey: ["checkEmail", email],
    queryFn: () => authAPI.checkEmailAvailable(email),
    enabled: enabled && email.includes("@"), // 이메일 형식일 때만 검사
    staleTime: 30000, // 30초간 캐시
    retry: 1,
  });
};
