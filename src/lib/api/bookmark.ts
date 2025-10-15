import { api } from "@/lib/http-client";
import type { InterviewListResponse } from "./interview";

// API Functions based on OpenAPI specification
export const bookmarkAPI = {
  // 모든 북마크 조회 (OpenAPI 스펙)
  getAll: (): Promise<unknown> => api.get("bookmark").json(),

  // 북마크 업데이트/토글 (OpenAPI 스펙)
  update: (interviewId: number): Promise<boolean> =>
    api.patch(`bookmark/${interviewId}`).json(),

  // Legacy methods for backward compatibility
  // 즐겨찾기 목록 조회 (기존)
  getAllLegacy: (): Promise<InterviewListResponse> =>
    api.get("bookmark").json(),

  // 즐겨찾기 토글 (기존)
  toggle: (interviewId: string): Promise<void> =>
    api.patch(`bookmark/${interviewId}`).json(),
};
