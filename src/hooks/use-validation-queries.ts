import { useQuery } from "@tanstack/react-query";

// 백엔드에 검증 API가 없으므로 클라이언트에서만 기본 형식 검사 수행

// 아이디 형식 검사 (백엔드 API 없음)
export const useCheckIdAvailable = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["checkId", id],
    queryFn: async () => {
      // 백엔드에 검증 API가 없으므로 기본 형식만 확인
      const isValidFormat = id.length >= 4 && /^[a-zA-Z0-9_]+$/.test(id);
      return { available: isValidFormat };
    },
    enabled: enabled && id.length >= 4,
    staleTime: 30000,
    retry: 1,
  });
};

// 이메일 형식 검사 (백엔드 API 없음)
export const useCheckEmailAvailable = (email: string, enabled = true) => {
  return useQuery({
    queryKey: ["checkEmail", email],
    queryFn: async () => {
      // 백엔드에 검증 API가 없으므로 기본 이메일 형식만 확인
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);
      return { available: isValidFormat };
    },
    enabled: enabled && email.includes("@") && email.length > 5,
    staleTime: 30000,
    retry: 1,
  });
};
