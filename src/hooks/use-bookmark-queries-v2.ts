import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarkAPI } from "@/lib/api/bookmark";
import { useAuthStore } from "@/stores/auth";

// Query keys
export const bookmarkKeys = {
  all: ["bookmarks-v2"] as const,
  lists: () => [...bookmarkKeys.all, "list"] as const,
};

// Queries
export function useBookmarks() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: bookmarkKeys.lists(),
    queryFn: bookmarkAPI.getAll,
    enabled: isAuthenticated,
  });
}

// Mutations
export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interviewId: number) => bookmarkAPI.update(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      // Also invalidate interviews list to update bookmark status
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}
