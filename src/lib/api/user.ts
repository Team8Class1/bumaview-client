import { api } from "@/lib/http-client";
import type { Data, UserDto } from "@/types/api";

// User API Functions
export const userAPI = {
  // 모든 유저 조회 (관리자용)
  getAll: (): Promise<Data<UserDto[]>> => {
    console.log("👥 전체 유저 목록 조회");
    return api.get("user").json();
  },

  // 특정 유저 조회
  getById: (userId: string): Promise<Data<UserDto>> => {
    console.log(`👤 유저 조회: userId=${userId}`);
    return api.get(`user/${userId}`).json();
  },
};
