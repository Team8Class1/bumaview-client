import { api } from "@/lib/http-client";
import type { AnswerDto, ReplyDto } from "@/types/api";

// Legacy types for backward compatibility
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

// API Functions
export const answerAPI = {
  // 답변 등록 (OpenAPI 스펙)
  create: (data: AnswerDto): Promise<void> =>
    api.post("api/answer", { json: data }).json(),

  // 대댓글 등록 (OpenAPI 스펙)
  createReply: (data: ReplyDto): Promise<void> =>
    api.post("api/answer/reply", { json: data }).json(),

  // 답변 좋아요 (OpenAPI 스펙)
  like: (answerId: number): Promise<void> =>
    api.post(`api/answer/like/${answerId}`).json(),

  // 답변 삭제 (OpenAPI 스펙)
  delete: (answerId: number): Promise<void> =>
    api.delete(`api/answer/${answerId}`).json(),

  // 답변 수정 (OpenAPI 스펙)
  modify: (answerId: number, data: AnswerDto): Promise<void> =>
    api.patch(`api/answer/${answerId}`, { json: data }).json(),

  // Legacy methods for backward compatibility
  // 답변 등록 (기존)
  createLegacy: (data: AnswerCreateRequest): Promise<void> =>
    api.post("api/answer", { json: data }).json(),

  // 대댓글 등록 (기존)
  replyLegacy: (data: AnswerReplyRequest): Promise<void> =>
    api.post("api/answer/reply", { json: data }).json(),

  // 답변 수정 (기존)
  update: (answerId: string, data: AnswerUpdateRequest): Promise<void> =>
    api.patch("api/answer", { json: { ...data, answerId } }).json(),

  // 좋아요 (기존, 오타 수정)
  likeLegacy: (answerId: string): Promise<void> =>
    api.post(`api/answer/like/${answerId}`).json(),
};
