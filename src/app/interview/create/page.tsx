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
  question: z
    .string()
    .min(10, "질문은 최소 10자 이상 입력해주세요.")
    .max(200, "질문은 최대 200자까지 입력 가능합니다."),
  categoryId: z.coerce.number().min(1, "직군을 선택해주세요."),
  companyId: z.coerce.number().min(1, "회사를 선택해주세요."),
  questionAt: z.string().min(1, "면접 년도를 입력해주세요."),
});

export default function InterviewCreatePage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // 실시간 유효성 검사를 위해 추가
    defaultValues: {
      question: "",
      companyId: undefined, // default value for non-nullable number
      categoryId: undefined,
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
                  <FormLabel>면접 년도</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="면접 년도를 선택해주세요." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2023">2023년</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    면접을 본 년도를 선택해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!form.formState.isValid || createInterviewMutation.isPending}
                className="w-full"
              >
                {createInterviewMutation.isPending
                  ? "등록 중..."
                  : "등록하기"}
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
            form.setValue("companyId", newCompany.companyId, {
              shouldValidate: true,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}
