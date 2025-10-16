import { api } from "@/lib/http-client";
import type { AllInterviewDto } from "@/types/api";

// 북마크 API 응답 타입
export interface BookmarkResponse {
  data: AllInterviewDto[];
}

export interface BookmarkToggleResponse {
  isBookmarked: boolean;
}

// 북마크 API 함수들
export const bookmarkAPI = {
  // 모든 북마크 조회
  getAll: async (): Promise<AllInterviewDto[]> => {
    try {
      const response = await api.get("bookmark").json<AllInterviewDto[] | BookmarkResponse>();
      
      // 응답이 배열인지 객체인지 확인
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        return (response as BookmarkResponse).data;
      } else {
        console.warn('Unexpected bookmark response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      throw error;
    }
  },

  // 북마크 토글 (추가/제거)
  toggle: async (interviewId: number): Promise<boolean> => {
    console.log(`🔄 북마크 토글 API 호출: interviewId=${interviewId}`);
    
    try {
      const response = await api.patch(`bookmark/${interviewId}`).json<boolean | BookmarkToggleResponse>();
      
      console.log(`✅ 북마크 토글 API 응답:`, response);
      
      // 응답이 boolean인지 객체인지 확인
      if (typeof response === 'boolean') {
        return response;
      } else if (response && typeof response === 'object' && 'isBookmarked' in response) {
        return (response as BookmarkToggleResponse).isBookmarked;
      } else {
        console.warn('⚠️ 예상치 못한 북마크 토글 응답 형식:', response);
        return false;
      }
    } catch (error) {
      console.error(`❌ 북마크 토글 API 실패 (interviewId: ${interviewId}):`, error);
      throw error;
    }
  },
};