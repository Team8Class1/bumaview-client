import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupAPI, type GroupCreateRequest, type GroupUpdateRequest, type GroupAddInterviewsRequest } from '@/lib/api'

// Query Keys
export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
}

// Queries
export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: groupAPI.getAll,
  })
}

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupAPI.getById(id),
    enabled: !!id,
  })
}

// Mutations
export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: groupAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
  })
}

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupUpdateRequest }) =>
      groupAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) => groupAPI.delete(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
  })
}

export const useAddInterviewsToGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: GroupAddInterviewsRequest }) =>
      groupAPI.addInterviews(groupId, data),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) })
    },
  })
}