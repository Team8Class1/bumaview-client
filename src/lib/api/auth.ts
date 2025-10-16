import { api } from "@/lib/http-client";
import type {
  JoinDto,
  LoginRequestDto,
  LoginResponse,
  UserInfoDto,
} from "@/types/api";

// API Functions
export const authAPI = {
  // 로그인
  login: (data: LoginRequestDto): Promise<LoginResponse> => {
    return api.post("user/login", { json: data }).json();
  },

  // 회원가입
  register: (data: JoinDto): Promise<string> =>
    api.post("user/register", { json: data }).json(),

  // 유저 정보 조회
  getUser: (): Promise<UserInfoDto> => api.get("user").json(),

  // 로그아웃 - 클라이언트에서만 처리 (백엔드에 로그아웃 API 없음)
  logout: async (): Promise<void> => {
    // 클라이언트 측에서만 토큰 제거
    return Promise.resolve();
  },
};
