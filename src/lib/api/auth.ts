import { api } from "@/lib/http-client";
import type { JoinDto, LoginRequestDto, UserInfoDto } from "@/types/api";

// API Functions
export const authAPI = {
  // 로그인
  login: (data: LoginRequestDto): Promise<unknown> => {
    return api.post("api/user/login", { json: data }).json();
  },

  // 회원가입
  register: (data: JoinDto): Promise<string> =>
    api.post("api/user/register", { json: data }).json(),

  // 유저 정보 조회
  getUser: (): Promise<UserInfoDto> => api.get("api/user").json(),
};
