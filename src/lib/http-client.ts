import ky from "ky";
import { useAuthStore } from "@/stores/auth";

// 백엔드 서버 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 백엔드에는 토큰 갱신 엔드포인트가 없으므로 간단한 인증 처리만

// ky 인스턴스 생성
export const api = ky.create({
  prefixUrl: "/api",
  credentials: "include", // 쿠키를 포함시키기 위한 설정
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초 타임아웃
  hooks: {
    beforeRequest: [
      async (request) => {
        // 로그인, 회원가입 요청은 토큰 없이 진행
        const url = request.url;
        if (
          url.includes("/api/user/login") ||
          url.includes("/api/user/register")
        ) {
          return;
        }

        // 인증이 필요한 요청에 토큰 추가 -> 쿠키 방식으로 변경되어 제거
        // const token = useAuthStore.getState().token;
        // if (token) {
        //   request.headers.set("Authorization", `Bearer ${token}`);
        // }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // 401 응답시 로그아웃 처리
        if (response.status === 401) {
          console.log("인증 실패 - 로그아웃 처리");
          useAuthStore.getState().logout();
        }

        if (!response.ok) {
          let errorMessage = "요청이 실패했습니다";
          try {
            const errorText = await response.text();
            try {
              const errorJson = JSON.parse(errorText);
              if (
                errorJson &&
                typeof errorJson === "object" &&
                "message" in errorJson &&
                typeof errorJson.message === "string"
              ) {
                errorMessage = errorJson.message;
              } else {
                errorMessage = errorText;
              }
            } catch {
              // Not a JSON, so the text is the error message
              errorMessage = errorText;
            }
          } catch {
            // Could not read the response body
          }
          throw new ApiError(
            response.status,
            errorMessage.trim() || "요청이 실패했습니다",
          );
        }
      },
    ],
  },
});

// 백엔드에 토큰 갱신 API가 없으므로 제거됨
