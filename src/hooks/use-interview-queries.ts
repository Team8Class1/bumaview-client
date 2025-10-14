import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { interviewAPI, type InterviewFilterParams, type InterviewSingleRequest, type InterviewUpdateRequest, type InterviewTrimSingleRequest } from '@/lib/api'

// Query Keys
export const interviewKeys = {
  all: ['interviews'] as const,
  lists: () => [...interviewKeys.all, 'list'] as const,
  list: (filters: InterviewFilterParams) => [...interviewKeys.lists(), { filters }] as const,
  details: () => [...interviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...interviewKeys.details(), id] as const,
  createData: () => [...interviewKeys.all, 'create-data'] as const,
}

// Queries
export const useInterviews = () => {
  return useQuery({
    queryKey: interviewKeys.lists(),
    queryFn: interviewAPI.getAll,
  })
}

export const useInterviewSearch = (params?: InterviewFilterParams) => {
  return useQuery({
    queryKey: interviewKeys.list(params || {}),
    queryFn: () => interviewAPI.search(params),
  })
}

export const useInterview = (id: string) => {
  return useQuery({
    queryKey: interviewKeys.detail(id),
    queryFn: () => interviewAPI.getById(id),
    enabled: !!id,
  })
}

export const useInterviewCreateData = () => {
  return useQuery({
    queryKey: interviewKeys.createData(),
    queryFn: interviewAPI.getCreateData,
  })
}

// Mutations
export const useCreateInterview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: interviewAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
    },
  })
}

export const useUpdateInterview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewUpdateRequest }) =>
      interviewAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
    },
  })
}

export const useDeleteInterview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: interviewAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
    },
  })
}

export const useUploadInterviewFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: interviewAPI.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
    },
  })
}

export const useTrimInterviewSingle = () => {
  return useMutation({
    mutationFn: interviewAPI.trimSingle,
  })
}

export const useTrimInterviewFile = () => {
  return useMutation({
    mutationFn: interviewAPI.trimFile,
  })
}