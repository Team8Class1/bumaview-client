import { api } from "@/lib/http-client";
import type {
  JoinDto,
  LoginRequestDto,
  UserInfoDto,
} from "@/types/api";

// API Functions
export const authAPI = {
  // 로그인
  login: async (data: LoginRequestDto): Promise<void> => {
    await api.post("user/login", { json: data });
  },

  // 회원가입
  register: (data: JoinDto): Promise<string> =>
    api.post("user/register", { json: data }).json(),

  // 유저 정보 조회
  getUser: (): Promise<UserInfoDto> => api.get("user").json(),

  // 로그아웃
  logout: async (): Promise<void> => {
    // 백엔드 로그아웃 API 호출하여 쿠키 삭제
    await api.post("user/logout");
  },
};
