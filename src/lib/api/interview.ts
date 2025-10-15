import { api } from "@/lib/http-client";
import type {
  DataListAllInterviewDto,
  FileUploadRequest,
  InterviewDto,
  InterviewSearchParams,
  ModifyInterviewDto,
  UploadInterviewDto,
} from "@/types/api";

// Legacy types for backward compatibility
export interface InterviewCategory {
  categoryId: number;
  categoryName: string;
}

export interface InterviewItem {
  interviewId: number;
  question: string;
  categoryList: InterviewCategory[];
  companyId: number | null;
  companyName: string | null;
  questionAt: string;
}

export interface InterviewListResponse {
  data: InterviewItem[];
}

export interface InterviewAnswer {
  userSequenceId: number;
  userId: string;
  answerId: number;
  answer: string;
  like: number;
  isPrivate?: boolean;
  parentAnswerId?: number;
  replies?: InterviewAnswer[];
}

export interface InterviewDetail extends InterviewItem {
  answer: InterviewAnswer[];
}

export interface InterviewCreateData {
  companyList: Array<{ companyId: number; companyName: string }>;
  categoryList: Array<{ categoryId: number; categoryName: string }>;
}

export interface InterviewSingleRequest {
  question: string;
  categoryList: number[];
  companyId: number | null;
  questionAt: string;
}

export interface InterviewUpdateRequest {
  interviewId: number;
  question: string;
  category: number[];
  companyId: number | null;
  questionAt: string;
}

export interface InterviewFilterParams {
  year?: string;
  companyId?: number;
  categoryId?: number;
  myQuestions?: boolean;
}

export interface InterviewTrimSingleRequest {
  question: string;
  category: Array<{ categoryId: number; categoryName: string }>;
  companyId: number | null;
  questionAt: string;
}

export interface InterviewTrimSingleResponse {
  question: string;
  category: Array<{ categoryId: number; categoryName: string }>;
  companyId: number | null;
  questionAt: string;
}

// API Functions
export const interviewAPI = {
  // 전체 인터뷰 조회
  getAll: (): Promise<InterviewListResponse> =>
    api.get("interview/all").json(),

  // 조건별 검색
  search: (params?: InterviewFilterParams): Promise<InterviewListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.year) searchParams.append("year", params.year);
    if (params?.companyId)
      searchParams.append("companyId", params.companyId.toString());
    if (params?.categoryId)
      searchParams.append("categoryId", params.categoryId.toString());
    if (params?.myQuestions)
      searchParams.append("myQuestions", params.myQuestions.toString());

    const queryString = searchParams.toString();
    return api
      .get(`interview/search${queryString ? `?${queryString}` : ""}`)
      .json();
  },

  // 단건 조회
  getById: (id: string): Promise<InterviewDetail> =>
    api.get(`interview/${id}`).json(),

  // 업로드시 필요한 기본 정보
  getCreateData: (): Promise<InterviewCreateData> =>
    api.get("interview/create").json(),

  // 단건 생성
  create: (data: InterviewSingleRequest): Promise<void> =>
    api.post("interview/single", { json: data }).json(),

  // 단건 수정
  update: (id: string, data: InterviewUpdateRequest): Promise<void> =>
    api.patch(`interview/${id}`, { json: data }).json(),

  // 단건 삭제
  delete: (id: string): Promise<void> =>
    api.delete(`interview/${id}`).json(),

  // CSV 파일 업로드
  uploadFile: async (file: File): Promise<Response> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("interview/file", { body: formData });
  },

  // 단건 질문 다듬기
  trimSingle: (
    data: InterviewTrimSingleRequest,
  ): Promise<InterviewTrimSingleResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("question", data.question);
    if (data.companyId)
      queryParams.append("companyId", data.companyId.toString());
    queryParams.append("questionAt", data.questionAt);

    return api
      .get(`interview/trim/single?${queryParams.toString()}`)
      .json();
  },

  // 파일 일괄 다듬기
  trimFile: async (file: File): Promise<Response> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("interview/trim/file", { body: formData });
  },

  // OpenAPI specification methods
  // 단일 인터뷰 업로드 (새 스펙)
  uploadSingle: (data: UploadInterviewDto): Promise<void> =>
    api.post("interview/single", { json: data }).json(),

  // CSV 파일 업로드 (새 스펙)
  uploadFromFile: (data: FileUploadRequest): Promise<void> => {
    const formData = new FormData();
    formData.append("file", data.file);
    return api.post("interview/file", { body: formData }).json();
  },

  // 인터뷰 수정 (새 스펙)
  modify: (interviewId: number, data: ModifyInterviewDto): Promise<void> =>
    api.patch(`interview/${interviewId}`, { json: data }).json(),

  // 인터뷰 검색 (새 스펙)
  searchByParams: (
    params: InterviewSearchParams,
  ): Promise<DataListAllInterviewDto> => {
    const searchParams = new URLSearchParams();

    if (params.questionAt) {
      for (const date of params.questionAt) {
        searchParams.append("questionAt", date.toString());
      }
    }
    if (params.companyId) {
      for (const id of params.companyId) {
        searchParams.append("companyId", id.toString());
      }
    }
    if (params.categoryId) {
      for (const id of params.categoryId) {
        searchParams.append("categoryId", id.toString());
      }
    }

    return api.get(`interview/search?${searchParams.toString()}`).json();
  },

  // 모든 인터뷰 조회 (새 스펙과 기존 통합)
  getAllBySpec: (): Promise<DataListAllInterviewDto> =>
    api.get("interview/all").json(),

  // 인터뷰 상세 조회 (새 스펙)
  getByIdSpec: (interviewId: number): Promise<InterviewDto> =>
    api.get(`interview/${interviewId}`).json(),

  // 인터뷰 삭제 (새 스펙)
  deleteByIdSpec: (interviewId: number): Promise<void> =>
    api.delete(`interview/${interviewId}`).json(),
};
