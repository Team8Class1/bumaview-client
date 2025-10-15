"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InterestSelector } from "@/components/ui/interest-selector";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { useRegisterMutation } from "@/hooks/use-auth-queries";
import { useInterestSelection } from "@/hooks/use-interest-selection";
import { useToast } from "@/hooks/use-toast";
import {
  useCheckEmailAvailable,
  useCheckIdAvailable,
} from "@/hooks/use-validation-queries";
import {
  AuthErrorType,
  classifyError,
  getFieldError,
} from "@/lib/error-handling";
import { type RegisterFormValues, registerSchema } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const registerMutation = useRegisterMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      id: "",
      password: "",
      passwordConfirm: "",
      interest: "",
    },
  });

  const { selectedInterests, toggleInterest } = useInterestSelection(
    (interests) => {
      form.setValue("interest", interests.join(","), { shouldValidate: true });
    },
  );

  // 실시간 검증을 위한 감시 값들
  const watchedId = form.watch("id");
  const watchedEmail = form.watch("email");
  const watchedPassword = form.watch("password");

  // 디바운싱된 검증 함수
  const debouncedIdCheck = useDebouncedCallback((id: string) => {
    if (id.length >= 4) {
      idQuery.refetch();
    }
  }, 500);

  const debouncedEmailCheck = useDebouncedCallback((email: string) => {
    if (email.includes("@")) {
      emailQuery.refetch();
    }
  }, 500);

  // 중복 검사 쿼리
  const idQuery = useCheckIdAvailable(watchedId, false);
  const emailQuery = useCheckEmailAvailable(watchedEmail, false);

  // 실시간 검증 트리거
  useEffect(() => {
    debouncedIdCheck(watchedId);
  }, [watchedId, debouncedIdCheck]);

  useEffect(() => {
    debouncedEmailCheck(watchedEmail);
  }, [watchedEmail, debouncedEmailCheck]);

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);

    const interests = selectedInterests;

    registerMutation.mutate(
      {
        email: data.email,
        id: data.id,
        password: data.password,
        interest: interests,
      },
      {
        onSuccess: () => {
          toast({
            title: "회원가입 성공",
            description: "환영합니다! 자동으로 로그인되었습니다.",
          });
          router.push("/");
        },
        onError: (error) => {
          const { type, message } = classifyError(error);
          const fieldError = getFieldError(type);

          // 특정 필드 에러가 있는 경우 해당 필드에 설정
          if (fieldError.field && fieldError.message) {
            form.setError(fieldError.field as keyof RegisterFormValues, {
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
      },
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            BumaView 계정을 생성하고 면접 준비를 시작하세요.
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
                        disabled={registerMutation.isPending}
                        autoComplete="email"
                      />
                    </FormControl>
                    {/* 이메일 중복 검사 결과 표시 */}
                    {watchedEmail.includes("@") && emailQuery.data && (
                      <FormDescription
                        className={
                          emailQuery.data.available
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {emailQuery.data.available
                          ? "✓ 사용 가능한 이메일입니다"
                          : "✗ 이미 사용 중인 이메일입니다"}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={registerMutation.isPending}
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormDescription>
                      4-20자 사이의 영문, 숫자, 언더스코어(_)만 사용 가능합니다.
                    </FormDescription>
                    {/* 아이디 중복 검사 결과 표시 */}
                    {watchedId.length >= 4 && idQuery.data && (
                      <FormDescription
                        className={
                          idQuery.data.available
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {idQuery.data.available
                          ? "✓ 사용 가능한 아이디입니다"
                          : "✗ 이미 사용 중인 아이디입니다"}
                      </FormDescription>
                    )}
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
                        disabled={registerMutation.isPending}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormDescription>
                      대문자, 소문자, 숫자, 특수문자를 모두 포함한 8자 이상
                    </FormDescription>
                    {/* 비밀번호 강도 표시기 */}
                    <PasswordStrength password={watchedPassword} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="비밀번호를 다시 입력하세요"
                        {...field}
                        disabled={registerMutation.isPending}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interest"
                render={() => (
                  <FormItem>
                    <FormLabel>관심 분야</FormLabel>
                    <FormDescription>
                      관심있는 분야를 선택해주세요. (복수 선택 가능)
                    </FormDescription>
                    <InterestSelector
                      selectedInterests={selectedInterests}
                      onToggleInterest={toggleInterest}
                      disabled={registerMutation.isPending}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "회원가입 중..." : "회원가입"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              이미 계정이 있으신가요?{" "}
            </span>
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
