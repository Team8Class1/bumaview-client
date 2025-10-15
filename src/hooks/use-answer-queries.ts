import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AnswerUpdateRequest, answerAPI } from "@/lib/api";
import { interviewKeys } from "./use-interview-queries";

// Mutations
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: answerAPI.create,
    onSuccess: (_, { interviewId }) => {
      queryClient.invalidateQueries({
        queryKey: interviewKeys.detail(interviewId.toString()),
      });
    },
  });
};

export const useCreateAnswerReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: answerAPI.createReply,
    onSuccess: (_, { interviewId }) => {
      queryClient.invalidateQueries({
        queryKey: interviewKeys.detail(interviewId.toString()),
      });
    },
  });
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      answerId,
      data,
    }: {
      answerId: string;
      data: AnswerUpdateRequest;
    }) => answerAPI.update(answerId, data),
    onSuccess: () => {
      // 모든 인터뷰 상세 정보 갱신 (어떤 인터뷰의 답변인지 모르므로)
      queryClient.invalidateQueries({ queryKey: interviewKeys.details() });
    },
  });
};

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string | number) => {
      // Support both string and number IDs for backward compatibility
      const numericId =
        typeof answerId === "string" ? parseInt(answerId, 10) : answerId;
      return answerAPI.delete(numericId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.details() });
    },
  });
};

export const useLikeAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string | number) => {
      // Support both string and number IDs for backward compatibility
      const numericId =
        typeof answerId === "string" ? parseInt(answerId, 10) : answerId;
      return answerAPI.like(numericId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.details() });
    },
  });
};
