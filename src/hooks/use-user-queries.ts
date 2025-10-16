import { useQuery } from "@tanstack/react-query";
import { userAPI } from "@/lib/api/user";
import { useAuthStore } from "@/stores/auth";
import type { Data, UserDto } from "@/types/api";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Queries
export function useUsers() {
  const { isAuthenticated } = useAuthStore();
  return useQuery<Data<UserDto[]>>({
    queryKey: userKeys.lists(),
    queryFn: () => userAPI.getAll(),
    enabled: isAuthenticated,
  });
}

export function useUser(userId: string) {
  const { isAuthenticated } = useAuthStore();
  return useQuery<Data<UserDto>>({
    queryKey: userKeys.detail(userId),
    queryFn: () => userAPI.getById(userId),
    enabled: !!userId && isAuthenticated,
  });
}
