import { useState } from "react";
import { bookmarkAPI } from "@/lib/api";
import { useToast } from "./use-toast";

export function useBookmark() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleToggleBookmark = async (
    e: React.MouseEvent,
    interviewId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // 이전 상태 저장 (롤백용)
    const prevBookmarkedIds = new Set(bookmarkedIds);

    // Optimistic update
    const newBookmarkedIds = new Set(bookmarkedIds);
    if (newBookmarkedIds.has(interviewId)) {
      newBookmarkedIds.delete(interviewId);
    } else {
      newBookmarkedIds.add(interviewId);
    }
    setBookmarkedIds(newBookmarkedIds);

    try {
      await bookmarkAPI.toggle(interviewId.toString());
      const isBookmarked = newBookmarkedIds.has(interviewId);
      toast({
        title: isBookmarked ? "북마크 추가" : "북마크 해제",
        description: isBookmarked
          ? "북마크에 추가되었습니다."
          : "북마크가 해제되었습니다.",
      });
    } catch (_error) {
      // 에러 시 롤백 및 최신 북마크 목록 재조회
      setBookmarkedIds(prevBookmarkedIds);
      try {
        const bookmarkResponse = await bookmarkAPI.getAll();
        setBookmarkedIds(
          new Set(bookmarkResponse.data.map((item) => item.interviewId)),
        );
      } catch {
        // 재조회 실패 시 이전 상태 유지
      }
      toast({
        variant: "destructive",
        title: "북마크 변경 실패",
        description: "북마크 변경에 실패했습니다.",
      });
    }
  };

  return {
    bookmarkedIds,
    setBookmarkedIds,
    handleToggleBookmark,
  };
}
