import { geminiApi } from "@/lib/gemini-http-client";
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
  getAll: (): Promise<InterviewListResponse> => api.get("interview/all").json(),

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
  delete: (id: string): Promise<void> => api.delete(`interview/${id}`).json(),

  // CSV 파일 업로드
  uploadFile: async (file: File): Promise<void> => {
    console.log("📁 인터뷰 파일 업로드 시작:", file.name, file.size, "bytes");
    console.log("📄 파일 타입:", file.type);
    console.log("📅 파일 수정일:", file.lastModified);

    // CSV 파일 내용 미리보기 (처음 500자)
    try {
      const fileText = await file.slice(0, 500).text();
      console.log("📝 CSV 파일 내용 미리보기 (처음 500자):");
      console.log(fileText);
    } catch (e) {
      console.warn("⚠️ 파일 내용 읽기 실패:", e);
    }

    const formData = new FormData();
    formData.append("file", file);

    // FormData 내용 확인
    console.log("📦 FormData 내용:");
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    try {
      console.log("🚀 API 요청 시작: POST /api/interview/file");
      console.log("📤 요청 설정:");
      console.log("  Method: POST");
      console.log("  URL: /api/interview/file");
      console.log("  Body: FormData");
      console.log("  Credentials: include");

      // 여러 엔드포인트 시도
      const endpoints = [
        "/api/interview/file",
        "/api/interview/upload",
        "/api/interview/csv",
        "/api/file/upload",
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          console.log(`🎯 엔드포인트 시도: ${endpoint}`);
          response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (response.ok) {
            console.log(`✅ 성공한 엔드포인트: ${endpoint}`);
            break;
          } else {
            console.log(
              `❌ 실패한 엔드포인트: ${endpoint} (${response.status})`,
            );
            lastError = await response.text();
          }
        } catch (error) {
          console.log(`💥 오류 발생 엔드포인트: ${endpoint}`, error);
          lastError = error;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`모든 엔드포인트 실패. 마지막 오류: ${lastError}`);
      }

      console.log("📡 응답 상태:", response.status, response.statusText);
      console.log(
        "📡 응답 헤더:",
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("📡 응답 내용:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // 응답 본문 확인
      const responseText = await response.text();
      console.log("📡 응답 본문:", responseText);

      let result;
      if (responseText.trim()) {
        try {
          result = JSON.parse(responseText);
          console.log("✅ 파일 업로드 성공 (JSON):", result);
        } catch (e) {
          console.log("✅ 파일 업로드 성공 (텍스트):", responseText);
          result = { message: responseText || "업로드 성공" };
        }
      } else {
        console.log("✅ 파일 업로드 성공 (빈 응답)");
        result = { message: "업로드 성공" };
      }

      return result;
    } catch (error) {
      console.error("❌ 파일 업로드 실패:", error);

      // 더 자세한 오류 정보 확인
      if (error instanceof Error && "response" in error) {
        const httpError = error as any;
        console.error("📋 오류 상세 정보:");
        console.error("  상태 코드:", httpError.response?.status);
        console.error("  상태 텍스트:", httpError.response?.statusText);

        try {
          const errorText = await httpError.response?.text();
          console.error("  응답 내용:", errorText);
        } catch (e) {
          console.error("  응답 내용 읽기 실패:", e);
        }
      }

      throw error;
    }
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

    return api.get(`interview/trim/single?${queryParams.toString()}`).json();
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

  // Gemini API로 단건 질문 다듬기
  trimSingleWithGemini: (question: string): Promise<{ question: string }> => {
    return geminiApi
      .post("api/interview/trim/single", { json: { question } })
      .json();
  },
};
