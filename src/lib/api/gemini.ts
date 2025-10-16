import { geminiApi } from "@/lib/gemini-http-client";

// Gemini API 요청/응답 타입
export interface TrimQuestionRequest {
  question: string;
}

export interface TrimQuestionResponse {
  modified_question: string;
  [key: string]: any; // 다른 필드들도 허용
}

// Gemini API 함수들
export const geminiAPI = {
  // 단일 질문 다듬기
  trimSingle: async (question: string): Promise<string> => {
    console.log("🤖 Gemini AI 질문 다듬기 시작:", question);
    
    try {
      const response = await geminiApi.post("api/interview/trim/single", {
        json: { question } as TrimQuestionRequest
      }).json<TrimQuestionResponse>();
      
      console.log("✅ Gemini AI 응답:", response);
      
      // modified_question 필드에서 다듬어진 질문 바로 사용
      return response.modified_question;
    } catch (error) {
      console.error("❌ Gemini AI 질문 다듬기 실패:", error);
      throw error;
    }
  },
};
