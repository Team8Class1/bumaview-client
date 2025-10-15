import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupAPI } from "@/lib/api/group";
import { useAuthStore } from "@/stores/auth";
import type { AddGroupList, GroupDto } from "@/types/api";

// Query keys
export const groupKeys = {
  all: ["groups-v2"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  details: () => [...groupKeys.all, "detail"] as const,
  detail: (id: number) => [...groupKeys.details(), id] as const,
  interviews: (id: number) => [...groupKeys.detail(id), "interviews"] as const,
};

// Queries
export function useGroups() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: () => groupAPI.getAll(),
    enabled: isAuthenticated,
  });
}

export function useGroupInterviews(groupId: number) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: groupKeys.interviews(groupId),
    queryFn: () => groupAPI.getInterviews(groupId),
    enabled: !!groupId && isAuthenticated,
  });
}

// Mutations
export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroupDto) => groupAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GroupDto }) =>
      groupAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
}

export function useAddInterviewsToGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: number; data: AddGroupList }) =>
      groupAPI.addInterviews(groupId, data),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.interviews(groupId),
      });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
    },
  });
}
