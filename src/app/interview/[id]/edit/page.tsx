"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useInterview, useInterviewCreateData, useUpdateInterview } from "@/hooks/use-interview-queries";

const interviewSchema = z.object({
  question: z
    .string()
    .min(5, { message: "질문은 최소 5자 이상이어야 합니다." }),
  categoryList: z
    .array(z.number())
    .min(1, { message: "최소 1개의 카테고리를 선택해주세요." }),
  companyId: z.string().optional(),
  questionAt: z.string().min(1, { message: "질문 날짜를 입력해주세요." }),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

export default function InterviewEditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // React Query hooks
  const { data: interview, isLoading: isLoadingInterview } = useInterview(params.id as string);
  const { data: createData, isLoading: isLoadingData } = useInterviewCreateData();
  const updateInterviewMutation = useUpdateInterview();

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      question: "",
      categoryList: [],
      companyId: "none",
      questionAt: "",
    },
  });

  // 인터뷰 데이터 로드 시 폼에 설정
  useEffect(() => {
    if (interview) {
      form.setValue("question", interview.question);
      form.setValue("questionAt", interview.questionAt);
      form.setValue("companyId", interview.companyId?.toString() || "none");

      const categoryIds = interview.categoryList.map(cat => cat.categoryId);
      setSelectedCategories(categoryIds);
      form.setValue("categoryList", categoryIds);
    }
  }, [interview, form]);

  const toggleCategory = (categoryId: number) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    form.setValue("categoryList", newCategories, { shouldValidate: true });
  };

  const onSubmit = (data: InterviewFormValues) => {
    if (!interview) return;

    updateInterviewMutation.mutate({
      id: params.id as string,
      data: {
        interviewId: interview.interviewId,
        question: data.question,
        category: selectedCategories,
        companyId:
          data.companyId && data.companyId !== "none"
            ? Number(data.companyId)
            : null,
        questionAt: data.questionAt,
      },
    }, {
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
    });
  };

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
                        <textarea
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
                  name="categoryList"
                  render={() => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <FormDescription>
                        질문과 관련된 분야를 선택해주세요. (복수 선택 가능)
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {createData.categoryList.map((category) => (
                          <Button
                            key={category.categoryId}
                            type="button"
                            variant={
                              selectedCategories.includes(category.categoryId)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => toggleCategory(category.categoryId)}
                            disabled={updateInterviewMutation.isPending}
                            className="justify-start"
                          >
                            {category.categoryName}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>회사명 (선택)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={updateInterviewMutation.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="회사를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">선택 안 함</SelectItem>
                          {createData.companyList.map((company) => (
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
                        특정 회사의 면접이라면 선택해주세요.
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
                      <FormLabel>질문 날짜</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={updateInterviewMutation.isPending}
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
                    disabled={updateInterviewMutation.isPending}
                    className="flex-1"
                    size="lg"
                  >
                    {updateInterviewMutation.isPending ? "수정 중..." : "수정 완료"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={updateInterviewMutation.isPending}
                    size="lg"
                  >
                    취소
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
