import ky from "ky";
import { useAuthStore } from "@/stores/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ky 인스턴스 생성
export const api = ky.create({
  prefixUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        // JWT 토큰 가져오기
        const token = useAuthStore.getState().token;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }

        if (!response.ok) {
          let errorMessage = "Request failed";
          try {
            const error = await response.json();
            if (
              error &&
              typeof error === "object" &&
              "message" in error &&
              typeof error.message === "string"
            ) {
              errorMessage = error.message || errorMessage;
            }
          } catch {
            // JSON 파싱 실패시 기본 메시지 사용
          }
          throw new ApiError(response.status, errorMessage);
        }
      },
    ],
  },
});
