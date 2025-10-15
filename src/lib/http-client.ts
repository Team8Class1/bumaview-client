import ky from "ky";
import { useAuthStore } from "@/stores/auth";
import { TokenManager } from "./token-manager";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" || !API_BASE_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 토큰 갱신 함수
async function refreshToken(): Promise<string | null> {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("토큰 갱신 실패");

    const data = await response.json();
    if (data.accessToken) {
      TokenManager.setTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn,
      );
      useAuthStore.getState().setToken(data.accessToken);
      return data.accessToken;
    }
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    TokenManager.clearTokens();
    useAuthStore.getState().logout();
  }

  return null;
}

// ky 인스턴스 생성
export const api = ky.create({
  prefixUrl: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [
      async (request) => {
        // 로그인, 회원가입, 비밀번호 재설정 요청은 토큰 없이 진행
        const url = request.url;
        if (
          url.includes("/api/user/login") ||
          url.includes("/api/user/register") ||
          url.includes("/api/user/reset-password") ||
          url.includes("/api/user/check-id/") ||
          url.includes("/api/user/check-email/")
        ) {
          return;
        }

        // 토큰 만료 체크 및 자동 갱신
        if (TokenManager.isTokenExpired()) {
          const newToken = await refreshToken();
          if (newToken) {
            request.headers.set("Authorization", `Bearer ${newToken}`);
          }
        } else {
          // 기존 토큰 사용
          const token =
            TokenManager.getAccessToken() || useAuthStore.getState().token;
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        // 401 응답시 토큰 갱신 시도
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            // 새 토큰으로 요청 재시도
            const newRequest = request.clone();
            newRequest.headers.set("Authorization", `Bearer ${newToken}`);
            return ky(newRequest);
          } else {
            // 토큰 갱신 실패시 로그아웃
            useAuthStore.getState().logout();
          }
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

// 토큰 갱신 API 추가
export const authAPI = {
  refreshToken: async (): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }> => {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

    return api
      .post("api/auth/refresh", {
        json: { refreshToken },
      })
      .json();
  },
};
