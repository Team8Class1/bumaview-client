import { api } from "@/lib/http-client";
import type { InterviewListResponse } from "./interview";

// API Functions
export const bookmarkAPI = {
  // 즐겨찾기 목록 조회
  getAll: (): Promise<InterviewListResponse> => api.get("api/bookmark").json(),

  // 즐겨찾기 토글
  toggle: (interviewId: string): Promise<void> =>
    api.patch(`api/bookmark/${interviewId}`).json(),
};
