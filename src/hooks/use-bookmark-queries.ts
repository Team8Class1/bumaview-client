import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarkAPI } from "@/lib/api";

// Query Keys
export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  list: () => [...bookmarkKeys.all, "list"] as const,
};

// Queries
export const useBookmarks = () => {
  return useQuery({
    queryKey: bookmarkKeys.list(),
    queryFn: bookmarkAPI.getAllLegacy,
  });
};

// Mutations
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookmarkAPI.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
      // 인터뷰 목록도 갱신 (북마크 상태 변경)
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
};
