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
    queryFn: async () => {
      const response: { available: boolean } | boolean =
        await authAPI.checkEmailAvailable(email);
      console.log(`Email check response for ${email}:`, response);

      // 직접적인 boolean 응답 처리
      if (typeof response === "boolean") {
        return { available: response };
      }

      // 객체 형식 응답 처리
      if (response && typeof response === "object") {
        return response as { available: boolean };
      }

      // 예상치 못한 형식일 경우 기본값 반환 또는 에러 처리
      console.error("Unexpected email check response format:", response);
      // 기본적으로는 사용 불가능하다고 처리하여 보안 위험을 줄임
      return { available: false };
    },
    enabled: enabled && email.includes("@") && email.length > 5, // 이메일 형식일 때만 검사
    staleTime: 30000, // 30초간 캐시
    retry: 1,
  });
};
