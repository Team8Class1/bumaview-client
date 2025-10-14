import { api } from '@/lib/http-client'
import type { InterviewItem } from './interview'

// Types
export interface Group {
  groupId: number
  name: string
  createdAt?: string
}

export interface GroupDetail extends Group {
  interviews: InterviewItem[]
}

export interface GroupListResponse {
  data: Group[]
}

export interface GroupCreateRequest {
  name: string
}

export interface GroupUpdateRequest {
  name: string
}

export interface GroupAddInterviewsRequest {
  interviewIdList: number[]
}

// API Functions
export const groupAPI = {
  // 모든 그룹 조회
  getAll: (): Promise<GroupListResponse> =>
    api.get('api/group').json(),

  // 그룹 상세 조회
  getById: (groupId: string): Promise<GroupDetail> =>
    api.get(`api/group/${groupId}`).json(),

  // 그룹 생성
  create: (data: GroupCreateRequest): Promise<Group> =>
    api.post('api/group', { json: data }).json(),

  // 그룹 이름 수정
  update: (groupId: string, data: GroupUpdateRequest): Promise<void> =>
    api.patch(`api/group/${groupId}`, { json: data }).json(),

  // 그룹 삭제
  delete: (groupId: string): Promise<void> =>
    api.delete(`api/group/${groupId}`).json(),

  // 그룹에 인터뷰 추가
  addInterviews: (groupId: string, data: GroupAddInterviewsRequest): Promise<void> =>
    api.post(`api/group/${groupId}`, { json: data }).json(),
}