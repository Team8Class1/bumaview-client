import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type CompanyUpdateRequest, companyAPI } from "@/lib/api";

// Query Keys
export const companyKeys = {
  all: ["companies"] as const,
  list: () => [...companyKeys.all, "list"] as const,
};

// Queries
export const useCompanies = () => {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: companyAPI.getAll,
  });
};

// Mutations
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.list() });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompanyUpdateRequest }) =>
      companyAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.list() });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.list() });
    },
  });
};
