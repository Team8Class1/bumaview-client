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
    return api.post("api/user/login", { json: data }).json();
  },

  // 회원가입
  register: (data: JoinDto): Promise<string> =>
    api.post("api/user/register", { json: data }).json(),

  // 유저 정보 조회
  getUser: (): Promise<UserInfoDto> => api.get("api/user").json(),

  // 아이디 중복 검사
  checkIdAvailable: (id: string): Promise<{ available: boolean }> =>
    api.get(`api/user/check-id/${encodeURIComponent(id)}`).json(),

  // 이메일 중복 검사
  checkEmailAvailable: (email: string): Promise<{ available: boolean }> =>
    api.get(`api/user/check-email/${encodeURIComponent(email)}`).json(),

  // 비밀번호 재설정 요청
  requestPasswordReset: (email: string): Promise<{ message: string }> =>
    api.post("api/user/reset-password", { json: { email } }).json(),

  // 비밀번호 변경
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> =>
    api.patch("api/user/password", { json: data }).json(),
};
