"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useTrimQuestionMutation } from "@/hooks/use-gemini-queries";
import {
  useCreateInterviewMutation,
  useInterviewCreateData,
} from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  question: z
    .string()
    .min(10, "질문은 최소 10자 이상 입력해주세요.")
    .max(200, "질문은 최대 200자까지 입력 가능합니다."),
  categoryId: z.coerce.number().min(1, "직군을 선택해주세요."),
  companyId: z.coerce.number().min(1, "회사를 선택해주세요."),
  questionAt: z.string().min(1, "면접 날짜를 입력해주세요."),
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
      questionAt: "",
    },
  });
  const { toast } = useToast();

  const { data: createData } = useInterviewCreateData();
  const createInterviewMutation = useCreateInterviewMutation();
  const trimQuestionMutation = useTrimQuestionMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createInterviewMutation.mutate(
      {
        question: values.question,
        companyId: values.companyId,
        questionAt: values.questionAt, // 입력된 값 그대로 전송
        categoryList: [values.categoryId],
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

  const handleTrimQuestion = () => {
    const currentQuestion = form.getValues("question");

    if (!currentQuestion.trim()) {
      toast({
        variant: "destructive",
        title: "질문을 입력해주세요",
        description: "다듬을 질문을 먼저 입력해주세요.",
      });
      return;
    }

    trimQuestionMutation.mutate(currentQuestion, {
      onSuccess: (trimmedQuestion) => {
        form.setValue("question", trimmedQuestion, { shouldValidate: true });
      },
    });
  };

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
        <CardDescription>새로운 면접 질문을 등록하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>질문</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTrimQuestion}
                      disabled={
                        isLoading ||
                        trimQuestionMutation.isPending ||
                        !field.value?.trim()
                      }
                      className="h-8"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {trimQuestionMutation.isPending
                        ? "AI 다듬는 중..."
                        : "AI로 다듬기"}
                    </Button>
                  </div>
                  <FormControl>
                    <textarea
                      placeholder="면접 질문을 입력하세요"
                      className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    실제 면접에서 받은 질문을 입력해주세요. AI로 다듬기 버튼을
                    눌러 질문을 개선할 수 있습니다.
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
                      disabled={createInterviewMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    면접을 본 날짜를 입력해주세요. (예: 2025-10-09)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || createInterviewMutation.isPending
                }
                className="w-full"
              >
                {createInterviewMutation.isPending ? "등록 중..." : "등록하기"}
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
      </CardContent>
    </Card>
  );
}
