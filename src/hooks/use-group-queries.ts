import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type GroupAddInterviewsRequest,
  type GroupUpdateRequest,
  groupAPI,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

// Query Keys
export const groupKeys = {
  all: ["groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  details: () => [...groupKeys.all, "detail"] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
};

// Queries
export const useGroups = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: groupAPI.getAllLegacy,
    enabled: isAuthenticated,
  });
};

export const useGroup = (id: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupAPI.getById(id),
    enabled: !!id && isAuthenticated,
  });
};

// Mutations
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupAPI.createLegacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupUpdateRequest }) =>
      groupAPI.updateLegacy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupAPI.deleteLegacy(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useAddInterviewsToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: GroupAddInterviewsRequest;
    }) => groupAPI.addInterviewsLegacy(groupId, data),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
    },
  });
};
