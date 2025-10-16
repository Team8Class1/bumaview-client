import { api } from "@/lib/http-client";
import type {
  AddGroupList,
  AllInterviewDto,
  CreateGroupDto,
  Data,
  GroupDto,
} from "@/types/api";

// API Functions based on OpenAPI specification
export const groupAPI = {
  // 모든 그룹 조회 (OpenAPI 스펙)
  getAll: (): Promise<Data<GroupDto[]>> => api.get("group").json(),

  // 그룹 생성 (OpenAPI 스펙)
  create: (data: CreateGroupDto): Promise<void> =>
    api.post("group", { json: data }).json(),

  // 그룹에 인터뷰 추가 (OpenAPI 스펙)
  addInterviews: (groupId: number, data: AddGroupList): Promise<void> =>
    api.post(`group/${groupId}`, { json: data }).json(),

  // 그룹 삭제 (OpenAPI 스펙)
  delete: (groupId: number): Promise<void> =>
    api.delete(`group/${groupId}`).json(),

  // 그룹 수정 (OpenAPI 스펙)
  update: (groupId: number, data: CreateGroupDto): Promise<void> =>
    api.patch(`group/${groupId}`, { json: data }).json(),

  // 그룹의 인터뷰 조회 (OpenAPI 스펙)
  getInterviews: (groupId: number): Promise<Data<AllInterviewDto[]>> =>
    api.get(`group/${groupId}/interviews`).json(),
};
