import { api } from '@/lib/http-client'

// Types
export interface LoginRequest {
  id: string
  password: string
}

export interface RegisterRequest {
  email: string
  id: string
  password: string
  interest: string[]
}

export interface AuthResponse {
  id: string
  email?: string
  role?: string
  token?: string
}

// API Functions
export const authAPI = {
  // 로그인
  login: (data: LoginRequest): Promise<AuthResponse> => {
    const params = new URLSearchParams({
      id: data.id,
      password: data.password,
    })
    return api.get(`api/user/login?${params.toString()}`).json()
  },

  // 회원가입
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('api/user/register', { json: data }).json(),

  // 유저 정보 조회
  getUser: (): Promise<AuthResponse> =>
    api.get('api/user').json(),
}