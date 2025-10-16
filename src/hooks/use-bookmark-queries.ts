import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarkAPI } from "@/lib/api/bookmark";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/use-toast";
import type { AllInterviewDto } from "@/types/api";

// Query keys
export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  lists: () => [...bookmarkKeys.all, "list"] as const,
};

// 북마크 목록 조회 쿼리
export function useBookmarks() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: bookmarkKeys.lists(),
    queryFn: bookmarkAPI.getAll,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

// 북마크 토글 뮤테이션 (Optimistic Update 포함)
export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: bookmarkAPI.toggle,
    
    // Optimistic Update
    onMutate: async (interviewId: number) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.lists() });
      
      // 이전 데이터 백업
      const previousBookmarks = queryClient.getQueryData<AllInterviewDto[]>(bookmarkKeys.lists());
      
      // Optimistic update 적용
      if (previousBookmarks) {
        const isCurrentlyBookmarked = previousBookmarks.some(item => item.interviewId === interviewId);
        
        if (isCurrentlyBookmarked) {
          // 북마크 제거
          const newBookmarks = previousBookmarks.filter(item => item.interviewId !== interviewId);
          queryClient.setQueryData(bookmarkKeys.lists(), newBookmarks);
        }
        // 북마크 추가는 전체 인터뷰 데이터가 필요하므로 optimistic update 하지 않음
      }
      
      return { previousBookmarks, interviewId };
    },
    
    // 성공 시
    onSuccess: (isBookmarked: boolean, interviewId: number) => {
      console.log(`🎉 북마크 토글 성공: interviewId=${interviewId}, isBookmarked=${isBookmarked}`);
      
      // 서버 응답에 따라 캐시 직접 업데이트
      const currentBookmarks = queryClient.getQueryData<AllInterviewDto[]>(bookmarkKeys.lists()) || [];
      
      if (isBookmarked) {
        // 북마크 추가: 전체 데이터 다시 가져오기 (새 인터뷰 정보 필요)
        queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      } else {
        // 북마크 해제: 목록에서 제거
        const updatedBookmarks = currentBookmarks.filter(item => item.interviewId !== interviewId);
        queryClient.setQueryData(bookmarkKeys.lists(), updatedBookmarks);
        console.log(`🗑️ 북마크 목록에서 제거: interviewId=${interviewId}, 남은개수=${updatedBookmarks.length}`);
      }
      
      // 인터뷰 목록 캐시도 업데이트 (북마크 상태 반영)
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      
      toast({
        title: isBookmarked ? "북마크 추가" : "북마크 해제",
        description: isBookmarked 
          ? "북마크에 추가되었습니다." 
          : "북마크가 해제되었습니다.",
      });
    },
    
    // 실패 시 롤백
    onError: (error: any, interviewId: number, context: any) => {
      // 이전 데이터로 롤백
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.lists(), context.previousBookmarks);
      }
      
      toast({
        variant: "destructive",
        title: "북마크 변경 실패",
        description: error?.message || "북마크 변경에 실패했습니다. 다시 시도해주세요.",
      });
    },
    
    // 완료 후 (성공/실패 관계없이)
    onSettled: () => {
      // onSuccess에서 이미 처리했으므로 추가 invalidate 불필요
      console.log(`✅ 북마크 토글 완료`);
    },
  });
}

// 북마크 상태 확인 훅
export function useBookmarkStatus(interviewId: number) {
  const { data: bookmarks } = useBookmarks();
  
  const isBookmarked = bookmarks?.some(item => item.interviewId === interviewId) ?? false;
  
  console.log(`📊 북마크 상태 확인: interviewId=${interviewId}, isBookmarked=${isBookmarked}, 전체북마크수=${bookmarks?.length || 0}`);
  
  return { isBookmarked };
}