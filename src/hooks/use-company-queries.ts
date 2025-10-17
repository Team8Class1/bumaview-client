import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewKeys } from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";
import { companyAPI } from "@/lib/api/company";
import type { CompanyDto } from "@/types/api";

// Query keys
export const companyKeys = {
  all: ["company"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: number) => [...companyKeys.details(), id] as const,
};

// 회사 목록은 useInterviewCreateData()에서 가져옴
// 별도의 회사 조회 API가 없음

// Mutations
export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CompanyDto) => companyAPI.create(data),
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: interviewKeys.createData() });
      toast({
        title: "회사 추가 완료",
        description: `${newCompany.companyName} 회사가 추가되었습니다.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "회사 추가 실패",
        description:
          error instanceof Error
            ? error.message
            : "회사 추가 중 오류가 발생했습니다.",
      });
    },
  });
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      companyId,
      data,
    }: {
      companyId: number;
      data: CompanyDto;
    }) => companyAPI.modify(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(companyId),
      });
      queryClient.invalidateQueries({ queryKey: interviewKeys.createData() });
      toast({
        title: "회사 수정 완료",
        description: "회사 정보가 성공적으로 수정되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "회사 수정 실패",
        description:
          error instanceof Error
            ? error.message
            : "회사 수정 중 오류가 발생했습니다.",
      });
    },
  });
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (companyId: number) => companyAPI.delete(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: interviewKeys.createData() });
      toast({
        title: "회사 삭제 완료",
        description: "회사가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "회사 삭제 실패",
        description:
          error instanceof Error
            ? error.message
            : "회사 삭제 중 오류가 발생했습니다.",
      });
    },
  });
}
