import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "@/lib/api/company";
import type { CompanyDto } from "@/types/api";

// Query keys
export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
};

// Mutations
export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyDto) => companyAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      // Also invalidate interview create data as it includes company list
      queryClient.invalidateQueries({ queryKey: ["interviews", "createData"] });
    },
  });
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyDto }) =>
      companyAPI.modify(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companyAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}
