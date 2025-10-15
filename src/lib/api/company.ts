import { api } from "@/lib/http-client";
import type { CompanyDto } from "@/types/api";

// Legacy types for backward compatibility
export interface Company {
  companyId: number;
  companyName: string;
  link: string;
}

export interface CompanyListResponse {
  data: Company[];
}

export interface CompanyCreateRequest {
  companyName: string;
  link: string;
}

export interface CompanyUpdateRequest {
  companyName: string;
  link: string;
}

// API Functions based on OpenAPI specification
export const companyAPI = {
  // 회사 등록 (OpenAPI 스펙)
  create: (data: CompanyDto): Promise<void> =>
    api.post("company", { json: data }).json(),

  // 회사 삭제 (OpenAPI 스펙)
  delete: (companyId: number): Promise<void> =>
    api.delete(`company/${companyId}`).json(),

  // 회사 수정 (OpenAPI 스펙)
  modify: (companyId: number, data: CompanyDto): Promise<void> =>
    api.patch(`company/${companyId}`, { json: data }).json(),

  // Legacy methods for backward compatibility
  // 모든 회사 조회 (기존 - 스펙에 없음)
  getAll: (): Promise<CompanyListResponse> => api.get("company").json(),

  // 회사 등록 (기존)
  createLegacy: (data: CompanyCreateRequest): Promise<Company> =>
    api.post("company", { json: data }).json(),

  // 회사 수정 (기존)
  update: (companyId: string, data: CompanyUpdateRequest): Promise<void> =>
    api.patch(`company/${companyId}`, { json: data }).json(),

  // 회사 삭제 (기존)
  deleteLegacy: (companyId: string): Promise<void> =>
    api.delete(`company/${companyId}`).json(),
};
