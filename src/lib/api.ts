import { useAuthStore } from "@/stores/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }

    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  return response.json();
}

export const apiGet = <T>(endpoint: string) =>
  fetchApi<T>(endpoint, { method: "GET" });

export const apiPost = <T>(endpoint: string, data?: unknown) =>
  fetchApi<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = <T>(endpoint: string, data?: unknown) =>
  fetchApi<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = <T>(endpoint: string) =>
  fetchApi<T>(endpoint, { method: "DELETE" });

export const apiPatch = <T>(endpoint: string, data?: unknown) =>
  fetchApi<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });

// Auth API
export interface LoginRequest {
  id: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  id: string;
  password: string;
  interest: string[];
}

export interface AuthResponse {
  id: string;
  email?: string;
  role?: string;
  token?: string;
}

// Mock 데이터 (개발용)
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// Mock 데이터 저장소
const mockInterviewData: InterviewDetail = {
  interviewId: 1,
  question: "자기소개를 해주세요",
  categoryList: [
    { categoryId: 1, categoryName: "AI" },
    { categoryId: 2, categoryName: "백엔드" },
  ],
  companyId: 1,
  companyName: "삼성전자",
  questionAt: "2024-01-15",
  answer: [
    {
      userSequenceId: 1,
      userId: "user1",
      answerId: 1,
      answer:
        "안녕하세요. 저는 3년차 백엔드 개발자입니다. 주로 Spring Boot와 Node.js를 사용하여...",
      like: 15,
      isPrivate: false,
      replies: [
        {
          userSequenceId: 3,
          userId: "user3",
          answerId: 3,
          answer: "정말 좋은 답변입니다! 저도 Spring Boot를 주로 사용하는데...",
          like: 3,
          isPrivate: false,
          parentAnswerId: 1,
        },
      ],
    },
    {
      userSequenceId: 2,
      userId: "user2",
      answerId: 2,
      answer: "저는 최근 AI 프로젝트에 참여하면서...",
      like: 8,
      isPrivate: false,
      replies: [],
    },
  ],
};

let nextAnswerId = 4;

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    // Mock 로그인 - 항상 성공
    return {
      id: data.id,
      email: `${data.id}@example.com`,
      role: data.id === "admin" ? "admin" : "basic",
      token: "mock-token-12345",
    };
  }
  const params = new URLSearchParams({
    id: data.id,
    password: data.password,
  });
  return apiGet<AuthResponse>(`/user/login?${params.toString()}`);
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    // Mock 회원가입 - 항상 성공
    return {
      id: data.id,
      email: data.email,
      role: "basic",
      token: "mock-token-12345",
    };
  }
  return apiPost<AuthResponse>("/user/register", data);
};

// Interview API
export interface InterviewCreateData {
  companyList: Array<{ companyId: number; companyName: string }>;
  categoryList: Array<{ categoryId: number; categoryName: string }>;
}

export interface InterviewSingleRequest {
  question: string;
  categoryList: number[];
  companyId: number | null;
  questionAt: string; // Date string (YYYY-MM-DD)
}

export const getInterviewCreateData =
  async (): Promise<InterviewCreateData> => {
    if (USE_MOCK) {
      await mockDelay();
      return {
        companyList: [
          { companyId: 1, companyName: "삼성전자" },
          { companyId: 2, companyName: "카카오" },
          { companyId: 3, companyName: "네이버" },
          { companyId: 4, companyName: "라인" },
          { companyId: 5, companyName: "쿠팡" },
        ],
        categoryList: [
          { categoryId: 1, categoryName: "AI" },
          { categoryId: 2, categoryName: "백엔드" },
          { categoryId: 3, categoryName: "프론트엔드" },
          { categoryId: 4, categoryName: "인프라" },
          { categoryId: 5, categoryName: "디자인" },
        ],
      };
    }
    return apiGet<InterviewCreateData>("/interview/create");
  };

export const createInterviewSingle = async (
  data: InterviewSingleRequest,
): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();
    return;
  }
  return apiPost("/interview/single", data);
};

export const uploadInterviewFile = async (file: File): Promise<Response> => {
  if (USE_MOCK) {
    await mockDelay();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API_BASE_URL}/interview/file`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

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

export interface InterviewFilterParams {
  year?: string;
  companyId?: number;
  categoryId?: number;
  myQuestions?: boolean;
}

export const getAllInterviews = async (): Promise<InterviewListResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    return {
      data: [
        {
          interviewId: 1,
          question: "자기소개를 해주세요",
          categoryList: [
            { categoryId: 1, categoryName: "AI" },
            { categoryId: 2, categoryName: "백엔드" },
          ],
          companyId: 1,
          companyName: "삼성전자",
          questionAt: "2024-01-15",
        },
        {
          interviewId: 2,
          question: "우리 회사에 지원한 이유는?",
          categoryList: [{ categoryId: 3, categoryName: "프론트엔드" }],
          companyId: 2,
          companyName: "카카오",
          questionAt: "2024-01-20",
        },
        {
          interviewId: 3,
          question: "가장 기억에 남는 프로젝트는?",
          categoryList: [
            { categoryId: 2, categoryName: "백엔드" },
            { categoryId: 4, categoryName: "인프라" },
          ],
          companyId: null,
          companyName: null,
          questionAt: "2024-02-01",
        },
      ],
    };
  }
  return apiGet<InterviewListResponse>("/interview/all");
};

export const getInterviews = async (
  params?: InterviewFilterParams,
): Promise<InterviewListResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    // 필터링 시뮬레이션
    const allData = await getAllInterviews();
    let filtered = allData.data;

    if (params?.companyId) {
      filtered = filtered.filter((item) => item.companyId === params.companyId);
    }
    if (params?.categoryId) {
      filtered = filtered.filter((item) =>
        item.categoryList.some((cat) => cat.categoryId === params.categoryId),
      );
    }

    return { data: filtered };
  }

  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append("year", params.year);
  if (params?.companyId)
    queryParams.append("companyId", params.companyId.toString());
  if (params?.categoryId)
    queryParams.append("categoryId", params.categoryId.toString());
  if (params?.myQuestions)
    queryParams.append("myQuestions", params.myQuestions.toString());

  const query = queryParams.toString();
  return apiGet<InterviewListResponse>(`/interview${query ? `?${query}` : ""}`);
};

export const getInterviewDetail = async (
  id: number,
): Promise<InterviewDetail> => {
  if (USE_MOCK) {
    await mockDelay();
    return { ...mockInterviewData, interviewId: id };
  }
  return apiGet<InterviewDetail>(`/interview/${id}`);
};

export const deleteInterview = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();
    return;
  }
  return apiDelete(`/interview/${id}`);
};

export interface InterviewUpdateRequest {
  interviewId: number;
  question: string;
  category: number[];
  companyId: number | null;
  questionAt: string;
}

export const updateInterview = async (
  id: number,
  data: InterviewUpdateRequest,
): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();
    return;
  }
  return apiPatch(`/interview/${id}`, data);
};

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

export const trimInterviewSingle = async (
  data: InterviewTrimSingleRequest,
): Promise<InterviewTrimSingleResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    // Mock: 간단한 텍스트 정리 시뮬레이션
    const trimmed = data.question
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[?？]+$/, "")
      .concat("?");
    return {
      ...data,
      question: trimmed,
    };
  }

  const queryParams = new URLSearchParams();
  queryParams.append("question", data.question);
  queryParams.append("category", JSON.stringify(data.category));
  if (data.companyId)
    queryParams.append("companyId", data.companyId.toString());
  queryParams.append("questionAt", data.questionAt);

  return apiGet<InterviewTrimSingleResponse>(
    `/interview/trim/single?${queryParams.toString()}`,
  );
};

export const trimInterviewFile = async (file: File): Promise<Response> => {
  if (USE_MOCK) {
    await mockDelay();
    // Mock: 다듬은 파일 다운로드 시뮬레이션
    const trimmedContent =
      "question,categoryIds,companyId,questionAt\n자기소개를 해주세요?,1;2,1,2024-01-15\n우리 회사에 지원한 이유는?,3,,2024-01-20";
    const blob = new Blob([trimmedContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trimmed_interviews.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API_BASE_URL}/interview/trim/file`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

// Answer API
export interface AnswerCreateRequest {
  interviewId: number;
  answer: string;
  isPrivate: boolean;
}

export interface AnswerReplyRequest {
  interviewId: number;
  answer: string;
  isPrivate: boolean;
  parentAnswerId: number;
}

export interface AnswerUpdateRequest {
  answer: string;
  private: boolean;
}

export interface AnswerLikeRequest {
  interviewId: number;
  answer: string;
  is_private: boolean;
}

export interface AnswerResponse {
  userSequenceId: number;
  userId: string;
  answerId: number;
  answer: string;
  like: number;
  isPrivate?: boolean;
  parentAnswerId?: number;
  replies?: AnswerResponse[];
}

export interface AnswerListResponse {
  answer: AnswerResponse[];
}

export const createAnswer = async (
  data: AnswerCreateRequest,
): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();

    // Mock 데이터에 새 답변 추가
    const newAnswer: InterviewAnswer = {
      userSequenceId: nextAnswerId,
      userId: "currentUser", // 현재 사용자 ID
      answerId: nextAnswerId,
      answer: data.answer,
      like: 0,
      isPrivate: data.isPrivate,
      replies: [],
    };

    mockInterviewData.answer.push(newAnswer);
    nextAnswerId++;
    return;
  }
  return apiPost("/answer", data);
};

export const createAnswerReply = async (
  data: AnswerReplyRequest,
): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();

    // Mock 데이터에 새 대댓글 추가
    const newReply: InterviewAnswer = {
      userSequenceId: nextAnswerId,
      userId: "currentUser", // 현재 사용자 ID
      answerId: nextAnswerId,
      answer: data.answer,
      like: 0,
      isPrivate: data.isPrivate,
      parentAnswerId: data.parentAnswerId,
    };

    // 부모 답변 찾아서 replies에 추가
    const parentAnswer = mockInterviewData.answer.find(
      (ans) => ans.answerId === data.parentAnswerId,
    );
    if (parentAnswer) {
      if (!parentAnswer.replies) {
        parentAnswer.replies = [];
      }
      parentAnswer.replies.push(newReply);
    }

    nextAnswerId++;
    return;
  }
  return apiPost("/answer/reply", data);
};

export const updateAnswer = async (
  answerId: number,
  data: AnswerUpdateRequest,
): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();

    // Mock 데이터에서 답변 찾아서 수정
    const updateAnswerInArray = (answers: InterviewAnswer[]) => {
      for (const answer of answers) {
        if (answer.answerId === answerId) {
          answer.answer = data.answer;
          answer.isPrivate = data.private;
          return true;
        }
        if (answer.replies) {
          if (updateAnswerInArray(answer.replies)) {
            return true;
          }
        }
      }
      return false;
    };

    updateAnswerInArray(mockInterviewData.answer);
    return;
  }
  return apiPatch(`/answer/${answerId}`, data);
};

export const deleteAnswer = async (answerId: number): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();

    // Mock 데이터에서 답변 삭제
    const deleteAnswerFromArray = (answers: InterviewAnswer[]) => {
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].answerId === answerId) {
          answers.splice(i, 1);
          return true;
        }
        const replies = answers[i].replies;
        if (replies && deleteAnswerFromArray(replies)) {
          return true;
        }
      }
      return false;
    };

    deleteAnswerFromArray(mockInterviewData.answer);
    return;
  }
  return apiDelete(`/answer/${answerId}`);
};

export const getAnswers = async (): Promise<AnswerListResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    return {
      answer: [
        {
          userSequenceId: 1,
          userId: "user1",
          answerId: 1,
          answer: "안녕하세요. 저는 3년차 백엔드 개발자입니다...",
          like: 15,
          isPrivate: false,
        },
        {
          userSequenceId: 2,
          userId: "user2",
          answerId: 2,
          answer: "저는 최근 AI 프로젝트에 참여하면서...",
          like: 8,
          isPrivate: false,
        },
      ],
    };
  }
  return apiGet<AnswerListResponse>("/answer");
};

export const likeAnswer = async (
  answerId: number,
  data: AnswerLikeRequest,
): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();

    // Mock 데이터에서 답변 찾아서 좋아요 증가
    const likeAnswerInArray = (answers: InterviewAnswer[]) => {
      for (const answer of answers) {
        if (answer.answerId === answerId) {
          answer.like++;
          return true;
        }
        if (answer.replies) {
          if (likeAnswerInArray(answer.replies)) {
            return true;
          }
        }
      }
      return false;
    };

    likeAnswerInArray(mockInterviewData.answer);
    return;
  }
  return apiPatch(`/answer/like/${answerId}`, data);
};

// Bookmark API
const mockBookmarks: number[] = [];

export const toggleBookmark = async (interviewId: number): Promise<void> => {
  if (USE_MOCK) {
    await mockDelay();

    // 북마크 토글
    const index = mockBookmarks.indexOf(interviewId);
    if (index > -1) {
      mockBookmarks.splice(index, 1);
    } else {
      mockBookmarks.push(interviewId);
    }
    return;
  }
  return apiPatch(`/bookmark/${interviewId}`);
};

export const getBookmarks = async (): Promise<InterviewListResponse> => {
  if (USE_MOCK) {
    await mockDelay();

    // 전체 인터뷰 목록에서 북마크된 것만 필터링
    const allData = await getAllInterviews();
    const bookmarkedInterviews = allData.data.filter((interview) =>
      mockBookmarks.includes(interview.interviewId),
    );

    return { data: bookmarkedInterviews };
  }
  return apiGet<InterviewListResponse>("/bookmark");
};
