import { api } from "@/lib/http-client";
import type { CompanyDto, CompanyWithId } from "@/types/api";

// API Functions based on OpenAPI specification
export const companyAPI = {
  // 회사 등록 (OpenAPI 스펙)
  create: (data: CompanyDto): Promise<CompanyWithId> =>
    api.post("company", { json: data }).json(),

  // 회사 삭제 (OpenAPI 스펙)
  delete: (companyId: number): Promise<void> =>
    api.delete(`company/${companyId}`).json(),

  // 회사 수정 (OpenAPI 스펙)
  modify: (companyId: number, data: CompanyDto): Promise<void> =>
    api.patch(`company/${companyId}`, { json: data }).json(),
};
