import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InterviewTrimSingleRequest } from "@/lib/api/interview";
import { interviewAPI } from "@/lib/api/interview";
import type {
  FileUploadRequest,
  InterviewSearchParams,
  ModifyInterviewDto,
  UploadInterviewDto,
} from "@/types/api";

// Query keys
export const interviewKeys = {
  all: ["interviews"] as const,
  lists: () => [...interviewKeys.all, "list"] as const,
  list: (filters: InterviewSearchParams) =>
    [...interviewKeys.lists(), { filters }] as const,
  details: () => [...interviewKeys.all, "detail"] as const,
  detail: (id: number) => [...interviewKeys.details(), id] as const,
  createData: () => [...interviewKeys.all, "createData"] as const,
};

// Queries
export function useInterviews() {
  return useQuery({
    queryKey: interviewKeys.lists(),
    queryFn: () => interviewAPI.getAllBySpec(),
  });
}

export function useInterviewSearch(params: InterviewSearchParams) {
  return useQuery({
    queryKey: interviewKeys.list(params),
    queryFn: () => interviewAPI.searchByParams(params),
  });
}

export function useInterview(id: number) {
  return useQuery({
    queryKey: interviewKeys.detail(id),
    queryFn: () => interviewAPI.getByIdSpec(id),
    enabled: !!id,
  });
}

export function useInterviewCreateData() {
  return useQuery({
    queryKey: interviewKeys.createData(),
    queryFn: () => interviewAPI.getCreateData(),
  });
}

// Mutations
export function useCreateInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadInterviewDto) => interviewAPI.uploadSingle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useUploadInterviewFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FileUploadRequest) => interviewAPI.uploadFromFile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useUpdateInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ModifyInterviewDto }) =>
      interviewAPI.modify(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useDeleteInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => interviewAPI.deleteByIdSpec(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useTrimInterviewSingleMutation() {
  return useMutation({
    mutationFn: (data: InterviewTrimSingleRequest) =>
      interviewAPI.trimSingle(data),
  });
}

export function useTrimInterviewFileMutation() {
  return useMutation({
    mutationFn: (file: File) => interviewAPI.trimFile(file),
  });
}

export function useTrimInterviewWithGeminiMutation() {
  return useMutation({
    mutationFn: (question: string) =>
      interviewAPI.trimSingleWithGemini(question),
  });
}
