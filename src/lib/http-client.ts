import ky from "ky";

// 백엔드 서버 URL

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
    afterResponse: async (_request, _options, response) => {
      if (!response.ok) {
        let errorMessage = "요청이 실패했습니다";
        const contentType = response.headers.get("Content-Type");

        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage =
              errorData.message || errorData.error || "JSON 오류 발생";
          } else {
            const text = await response.text();
            errorMessage =
              text || `HTTP ${response.status}: ${response.statusText}`; // 빈 응답 시 기본 메시지
          }
        } catch (e) {
          errorMessage = `응답 파싱 오류: ${e.message}`;
        }

        throw new ApiError(errorMessage, response.status);
      }
      return response;
    },
  },
});

// 백엔드에 토큰 갱신 API가 없으므로 제거됨
