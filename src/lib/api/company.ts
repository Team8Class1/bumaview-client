import { api } from '@/lib/http-client'

// Types
export interface Company {
  companyId: number
  companyName: string
  link: string
}

export interface CompanyListResponse {
  data: Company[]
}

export interface CompanyCreateRequest {
  companyName: string
  link: string
}

export interface CompanyUpdateRequest {
  companyName: string
  link: string
}

// API Functions
export const companyAPI = {
  // 모든 회사 조회
  getAll: (): Promise<CompanyListResponse> =>
    api.get('api/company').json(),

  // 회사 등록
  create: (data: CompanyCreateRequest): Promise<Company> =>
    api.post('api/company', { json: data }).json(),

  // 회사 수정
  update: (companyId: string, data: CompanyUpdateRequest): Promise<void> =>
    api.patch(`api/company/${companyId}`, { json: data }).json(),

  // 회사 삭제
  delete: (companyId: string): Promise<void> =>
    api.delete(`api/company/${companyId}`).json(),
}