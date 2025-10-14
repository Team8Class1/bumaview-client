import { api } from "@/lib/http-client";

// Types
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
    api.get("api/interview/all").json(),

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
      .get(`api/interview/search${queryString ? `?${queryString}` : ""}`)
      .json();
  },

  // 단건 조회
  getById: (id: string): Promise<InterviewDetail> =>
    api.get(`api/interview/${id}`).json(),

  // 업로드시 필요한 기본 정보
  getCreateData: (): Promise<InterviewCreateData> =>
    api.get("api/interview/create").json(),

  // 단건 생성
  create: (data: InterviewSingleRequest): Promise<void> =>
    api.post("api/interview/single", { json: data }).json(),

  // 단건 수정
  update: (id: string, data: InterviewUpdateRequest): Promise<void> =>
    api.patch(`api/interview/${id}`, { json: data }).json(),

  // 단건 삭제
  delete: (id: string): Promise<void> =>
    api.delete(`api/interview/${id}`).json(),

  // CSV 파일 업로드
  uploadFile: async (file: File): Promise<Response> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("api/interview/file", { body: formData });
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
      .get(`api/interview/trim/single?${queryParams.toString()}`)
      .json();
  },

  // 파일 일괄 다듬기
  trimFile: async (file: File): Promise<Response> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("api/interview/trim/file", { body: formData });
  },
};
