import { api } from '@/lib/http-client'

// Types
export interface AnswerCreateRequest {
  interviewId: number
  answer: string
  isPrivate: boolean
}

export interface AnswerReplyRequest {
  interviewId: number
  answer: string
  isPrivate: boolean
  parentAnswerId: number
}

export interface AnswerUpdateRequest {
  answer: string
  private: boolean
}

// API Functions
export const answerAPI = {
  // 답변 등록
  create: (data: AnswerCreateRequest): Promise<void> =>
    api.post('api/answer', { json: data }).json(),

  // 대댓글 등록
  createReply: (data: AnswerReplyRequest): Promise<void> =>
    api.post('api/answer/reply', { json: data }).json(),

  // 답변 수정
  update: (answerId: string, data: AnswerUpdateRequest): Promise<void> =>
    api.patch('api/answer', { json: { ...data, answerId } }).json(),

  // 답변 삭제
  delete: (answerId: string): Promise<void> =>
    api.delete(`api/answer/${answerId}`).json(),

  // 좋아요
  like: (answerId: string): Promise<void> =>
    api.post(`api/ansewr/like/${answerId}`).json(),
}