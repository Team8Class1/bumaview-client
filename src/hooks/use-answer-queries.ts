import { useMutation, useQueryClient } from "@tanstack/react-query";
import { answerAPI } from "@/lib/api/answer";
import type { CreateAnswerDto, ReplyDto } from "@/types/api";

// Mutations
export function useCreateAnswerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnswerDto) => answerAPI.create(data),
    onSuccess: (_, variables) => {
      // Invalidate the specific interview query to refetch answers
      queryClient.invalidateQueries({
        queryKey: ["interviews", "detail", variables.interviewId],
      });
    },
  });
}

export function useCreateReplyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReplyDto) => answerAPI.createReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", "detail", variables.interviewId],
      });
    },
  });
}

export function useLikeAnswerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: number) => answerAPI.like(answerId),
    onSuccess: () => {
      // Could invalidate specific interview or all interviews depending on UX needs
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}

export function useUpdateAnswerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateAnswerDto }) =>
      answerAPI.modify(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", "detail", variables.data.interviewId],
      });
    },
  });
}

export function useDeleteAnswerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: number) => answerAPI.delete(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}
