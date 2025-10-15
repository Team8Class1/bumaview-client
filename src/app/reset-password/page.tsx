"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePasswordReset } from "@/hooks/use-auth-queries";
import { useToast } from "@/hooks/use-toast";
import { AuthErrorType, classifyError } from "@/lib/error-handling";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/lib/validation/auth";

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const resetMutation = usePasswordReset();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    setServerError(null);

    resetMutation.mutate(data.email, {
      onSuccess: () => {
        setIsSuccess(true);
        toast({
          title: "비밀번호 재설정 요청 완료",
          description: "이메일로 비밀번호 재설정 링크를 전송했습니다.",
        });
      },
      onError: (error) => {
        const { type, message } = classifyError(error);

        if (type === AuthErrorType.USER_NOT_FOUND) {
          form.setError("email", {
            type: "server",
            message: "등록되지 않은 이메일입니다.",
          });
        } else {
          setServerError(message);
        }

        if (type === AuthErrorType.RATE_LIMITED) {
          toast({
            variant: "destructive",
            title: "요청 제한",
            description: message,
          });
        }
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              이메일 전송 완료
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              입력하신 이메일 주소로 비밀번호 재설정 링크를 전송했습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              이메일을 받지 못했다면 스팸함을 확인해주세요.
            </p>
            <Link href="/login">
              <Button className="w-full">로그인 페이지로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">비밀번호 재설정</CardTitle>
          <CardDescription>
            등록하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를
            전송해드립니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                        disabled={resetMutation.isPending}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending
                  ? "전송 중..."
                  : "비밀번호 재설정 링크 전송"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">계정이 기억나셨나요? </span>
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
