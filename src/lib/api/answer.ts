import { api } from "@/lib/http-client";
import type { AnswerDto, CreateAnswerDto, ReplyDto } from "@/types/api";

// API Functions
export const answerAPI = {
  // 답변 등록 (OpenAPI 스펙)
  create: (data: CreateAnswerDto): Promise<void> =>
    api.post("answer", { json: data }).json(),

  // 대댓글 등록 (OpenAPI 스펙)
  createReply: (data: ReplyDto): Promise<void> =>
    api.post("answer/reply", { json: data }).json(),

  // 답변 좋아요 (OpenAPI 스펙)
  like: (answerId: number): Promise<void> =>
    api.post(`answer/like/${answerId}`).json(),

  // 답변 삭제 (OpenAPI 스펙)
  delete: (answerId: number): Promise<void> =>
    api.delete(`answer/${answerId}`).json(),

  // 답변 수정 (OpenAPI 스펙)
  modify: (answerId: number, data: CreateAnswerDto): Promise<void> =>
    api.patch(`answer/${answerId}`, { json: data }).json(),
};
