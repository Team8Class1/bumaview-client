"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateInterviewMutation,
  useInterviewCreateData,
} from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";
import { AddCompanyDialog } from "@/components/interview/add-company-dialog";

const formSchema = z.object({
  question: z.string().min(1, "질문을 입력해주세요."),
  categoryId: z.coerce.number().min(1, "직군을 선택해주세요."),
  companyId: z.number().nullable(),
  questionAt: z.string().min(1, "면접 년도를 입력해주세요."),
});

export default function InterviewCreatePage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      companyId: null,
      questionAt: new Date().getFullYear().toString(),
    },
  });
  const { toast } = useToast();
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const { data: createData } = useInterviewCreateData();
  const createInterviewMutation = useCreateInterviewMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createInterviewMutation.mutate(
      {
        question: values.question,
        companyId: values.companyId || null,
        questionAt: values.questionAt,
        categoryList: [values.categoryId], // 단일 ID를 배열로 변환
      },
      {
        onSuccess: () => {
          toast({
            title: "등록 성공",
            description: "면접 질문이 성공적으로 등록되었습니다.",
          });
          // 폼 초기화
          form.reset();
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "등록 실패",
            description:
              error instanceof Error
                ? error.message
                : "질문 등록 중 오류가 발생했습니다.",
          });
        },
      },
    );
  }

  if (!createData) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">데이터를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = createInterviewMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">면접 질문 등록</CardTitle>
        <CardDescription>
          새로운 면접 질문을 등록하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>질문</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="면접 질문을 입력하세요"
                      className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    실제 면접에서 받은 질문을 입력해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>직군</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="직군을 선택해주세요." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {createData?.categoryList.map((category) => (
                        <SelectItem
                          key={category.categoryId}
                          value={category.categoryId.toString()}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    질문과 관련된 직군을 선택해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사명</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : null)
                    }
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="회사를 선택해주세요." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {createData?.companyList.map((company) => (
                        <SelectItem
                          key={company.companyId}
                          value={company.companyId.toString()}
                        >
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    질문과 관련된 회사를 선택해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddCompanyOpen(true)}
              className="mt-2"
            >
              새 회사 추가
            </Button>
            <FormField
              control={form.control}
              name="questionAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>질문 날짜</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={isLoading}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </FormControl>
                  <FormDescription>
                    면접을 본 날짜를 선택해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                size="lg"
              >
                {isLoading ? "등록 중..." : "등록"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                size="lg"
              >
                취소
              </Button>
            </div>
          </form>
        </Form>
        <AddCompanyDialog
          open={isAddCompanyOpen}
          onOpenChange={setIsAddCompanyOpen}
          onCompanyAdded={(newCompany) => {
            // In a real app, you'd get the actual new company object from the mutation.
            // For now, we'll optimistically update the form.
            form.setValue("companyId", newCompany.companyId);
          }}
        />
      </CardContent>
    </Card>
  );
}
