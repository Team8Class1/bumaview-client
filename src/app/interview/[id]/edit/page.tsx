"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useInterview,
  useInterviewCreateData,
  useUpdateInterviewMutation,
} from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  question: z.string().min(1, "질문을 입력해주세요."),
  categoryId: z.coerce.number().min(1, "직군을 선택해주세요."),
  companyId: z.coerce.number().min(1, "회사를 선택해주세요."),
  questionAt: z.string().min(1, "면접 날짜를 입력해주세요."),
});

export default function InterviewEditPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  // React Query hooks
  const { data: interview, isLoading: isLoadingInterview } = useInterview(
    Number(id),
  );
  const { data: createData, isLoading: isLoadingData } =
    useInterviewCreateData();
  const updateInterviewMutation = useUpdateInterviewMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    // Use `values` instead of `defaultValues` to handle async data
    values: interview
      ? {
          question: interview.question,
          categoryId: interview.categoryList[0]?.categoryId,
          companyId: interview.companyId,
          questionAt: interview.questionAt.substring(0, 10),
        }
      : {
          question: "",
          categoryId: undefined,
          companyId: undefined,
          questionAt: "",
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const requestData = {
      question: values.question,
      categoryList: [values.categoryId],
      companyId: values.companyId,
      questionAt: values.questionAt, // 입력된 값 그대로 전송
    };

    console.log("🔧 인터뷰 수정 요청 데이터:", requestData);
    console.log(
      "📅 questionAt 값:",
      values.questionAt,
      "타입:",
      typeof values.questionAt,
    );

    updateInterviewMutation.mutate(
      {
        id: Number(id),
        data: requestData,
      },
      {
        onSuccess: () => {
          toast({
            title: "수정 완료",
            description: "면접 질문이 성공적으로 수정되었습니다.",
          });
          router.push(`/interview/${interview.interviewId}`);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "수정 실패",
            description:
              error instanceof Error
                ? error.message
                : "질문 수정 중 오류가 발생했습니다.",
          });
        },
      },
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoadingInterview || isLoadingData}
        >
          ← 돌아가기
        </Button>
      </div>

      {isLoadingInterview || isLoadingData ? (
        <Loading />
      ) : !interview || !createData ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              면접 질문을 찾을 수 없습니다.
            </p>
            <Button
              onClick={() => router.push("/interview")}
              className="mt-4"
              variant="outline"
            >
              목록으로
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">면접 질문 수정</CardTitle>
            <CardDescription>면접 질문 정보를 수정하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>질문</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="면접 질문을 입력하세요"
                          className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          disabled={updateInterviewMutation.isPending}
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
                        value={field.value?.toString()}
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
                        onValueChange={(value) => field.onChange(Number(value))}
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

                <FormField
                  control={form.control}
                  name="questionAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>면접 날짜</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="YYYY-MM-DD"
                          {...field}
                          disabled={updateInterviewMutation.isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        면접을 본 날짜를 입력해주세요. (예: 2025-10-09)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={updateInterviewMutation.isPending}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.formState.isValid ||
                      updateInterviewMutation.isPending
                    }
                  >
                    {updateInterviewMutation.isPending ? "수정 중..." : "수정"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
