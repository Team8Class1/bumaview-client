import { api } from "@/lib/http-client";
import type { AddGroupList, Data, GroupDto } from "@/types/api";
import type { InterviewItem } from "./interview";

// Legacy types for backward compatibility
export interface Group {
  groupId: number;
  name: string;
  createdAt?: string;
}

export interface GroupDetail extends Group {
  interviews: InterviewItem[];
}

export interface GroupListResponse {
  data: Group[];
}

export interface GroupCreateRequest {
  name: string;
}

export interface GroupUpdateRequest {
  name: string;
}

export interface GroupAddInterviewsRequest {
  interviewIdList: number[];
}

// API Functions based on OpenAPI specification
export const groupAPI = {
  // 모든 그룹 조회 (OpenAPI 스펙)
  getAll: (): Promise<Data> => api.get("group").json(),

  // 그룹 생성 (OpenAPI 스펙)
  create: (data: GroupDto): Promise<void> =>
    api.post("group", { json: data }).json(),

  // 그룹에 인터뷰 추가 (OpenAPI 스펙)
  addInterviews: (groupId: number, data: AddGroupList): Promise<void> =>
    api.post(`group/${groupId}`, { json: data }).json(),

  // 그룹 삭제 (OpenAPI 스펙)
  delete: (groupId: number): Promise<void> =>
    api.delete(`group/${groupId}`).json(),

  // 그룹 수정 (OpenAPI 스펙)
  update: (groupId: number, data: GroupDto): Promise<void> =>
    api.patch(`group/${groupId}`, { json: data }).json(),

  // 그룹의 인터뷰 조회 (OpenAPI 스펙)
  getInterviews: (groupId: number): Promise<Data> =>
    api.get(`group/${groupId}/interviews`).json(),

  // Legacy methods for backward compatibility
  // 모든 그룹 조회 (기존)
  getAllLegacy: (): Promise<GroupListResponse> => api.get("group").json(),

  // 그룹 상세 조회 (기존)
  getById: (groupId: string): Promise<GroupDetail> =>
    api.get(`group/${groupId}`).json(),

  // 그룹 생성 (기존)
  createLegacy: (data: GroupCreateRequest): Promise<Group> =>
    api.post("group", { json: data }).json(),

  // 그룹 이름 수정 (기존)
  updateLegacy: (groupId: string, data: GroupUpdateRequest): Promise<void> =>
    api.patch(`group/${groupId}`, { json: data }).json(),

  // 그룹 삭제 (기존)
  deleteLegacy: (groupId: string): Promise<void> =>
    api.delete(`group/${groupId}`).json(),

  // 그룹에 인터뷰 추가 (기존)
  addInterviewsLegacy: (
    groupId: string,
    data: GroupAddInterviewsRequest,
  ): Promise<void> => api.post(`group/${groupId}`, { json: data }).json(),
};
