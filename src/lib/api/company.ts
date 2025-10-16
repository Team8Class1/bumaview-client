import { api } from "@/lib/http-client";
import type { CompanyDto, CompanyWithId, Data } from "@/types/api";

// API Functions based on OpenAPI specification
export const companyAPI = {
  // 모든 회사 조회
  getAll: (): Promise<Data<CompanyWithId[]>> => {
    console.log("🏢 전체 회사 목록 조회");
    return api.get("company").json();
  },

  // 특정 회사 조회
  getById: (companyId: number): Promise<Data<CompanyWithId>> => {
    console.log(`🏢 회사 조회: companyId=${companyId}`);
    return api.get(`company/${companyId}`).json();
  },

  // 회사 등록 (OpenAPI 스펙)
  create: (data: CompanyDto): Promise<CompanyWithId> => {
    console.log("🏢 회사 생성:", data);
    return api.post("company", { json: data }).json();
  },

  // 회사 수정 (OpenAPI 스펙)
  modify: (companyId: number, data: CompanyDto): Promise<void> => {
    console.log(`🏢 회사 수정: companyId=${companyId}`, data);
    return api.patch(`company/${companyId}`, { json: data }).json();
  },

  // 회사 삭제 (OpenAPI 스펙)
  delete: (companyId: number): Promise<void> => {
    console.log(`🏢 회사 삭제: companyId=${companyId}`);
    return api.delete(`company/${companyId}`).json();
  },
};
