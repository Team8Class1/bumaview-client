import { api } from "@/lib/http-client";
import type { AllInterviewDto } from "@/types/api";

// API Functions based on OpenAPI specification
export const bookmarkAPI = {
  // 모든 북마크 조회 (OpenAPI 스펙)
  getAll: (): Promise<AllInterviewDto[]> => api.get("bookmark").json(),

  // 북마크 업데이트/토글 (OpenAPI 스펙)
  update: (interviewId: number): Promise<boolean> =>
    api.patch(`bookmark/${interviewId}`).json(),
};
