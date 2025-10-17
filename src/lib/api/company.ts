import { api } from "@/lib/http-client";
import type { CompanyDto, CompanyWithId } from "@/types/api";

// API Functions based on OpenAPI specification
export const companyAPI = {
  // 회사 목록 조회 API가 없음 - useInterviewCreateData()에서 가져옴

  // 회사 등록 (OpenAPI 스펙)
  create: (data: CompanyDto): Promise<CompanyWithId> => {
    console.log("🏢 회사 생성 시작:", data);
    console.log("🏢 API 호출: POST /api/company");
    return api
      .post("company", { json: data })
      .json()
      .then((result) => {
        console.log("🏢 회사 생성 성공:", result);
        return result;
      })
      .catch((error) => {
        console.error("🏢 회사 생성 실패:", error);
        throw error;
      });
  },

  // 회사 수정 (OpenAPI 스펙)
  modify: (companyId: number, data: CompanyDto): Promise<void> => {
    console.log(`🏢 회사 수정 시작: companyId=${companyId}`, data);
    console.log(`🏢 API 호출: PATCH /api/company/${companyId}`);
    return api
      .patch(`company/${companyId}`, { json: data })
      .json()
      .then((result) => {
        console.log("🏢 회사 수정 성공:", result);
        return result;
      })
      .catch((error) => {
        console.error("🏢 회사 수정 실패:", error);
        throw error;
      });
  },

  // 회사 삭제 (OpenAPI 스펙)
  delete: (companyId: number): Promise<void> => {
    console.log(`🏢 회사 삭제: companyId=${companyId}`);
    return api.delete(`company/${companyId}`).json();
  },
};
