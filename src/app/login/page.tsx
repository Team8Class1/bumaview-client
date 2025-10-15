"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useLoginMutation } from "@/hooks/use-auth-queries-v2";
import { useToast } from "@/hooks/use-toast";
import {
  AuthErrorType,
  classifyError,
  getFieldError,
} from "@/lib/error-handling";
import { type LoginFormValues, loginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const loginMutation = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);

    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        });
        router.push("/");
      },
      onError: (error) => {
        const { type, message } = classifyError(error);
        const fieldError = getFieldError(type);

        // 특정 필드 에러가 있는 경우 해당 필드에 설정
        if (fieldError.field && fieldError.message) {
          form.setError(fieldError.field as keyof LoginFormValues, {
            type: "server",
            message: fieldError.message,
          });
        } else {
          // 일반적인 서버 에러는 폼 상단에 표시
          setServerError(message);
        }

        // Rate limit 에러는 토스트로도 표시
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

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            BumaView에 로그인하여 면접 준비를 시작하세요.
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
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이디</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="아이디를 입력하세요"
                        {...field}
                        disabled={loginMutation.isPending}
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="비밀번호를 입력하세요"
                        {...field}
                        disabled={loginMutation.isPending}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 재설정 링크 */}
              <div className="text-right">
                <Link
                  href="/reset-password"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
