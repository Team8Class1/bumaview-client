"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";

const registerSchema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 주소를 입력해주세요." }),
    id: z
      .string()
      .min(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
      .max(20, { message: "아이디는 최대 20자까지 가능합니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
    passwordConfirm: z.string(),
    interest: z
      .string()
      .min(1, { message: "관심사를 최소 하나 이상 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const INTEREST_OPTIONS = [
  "AI",
  "백엔드",
  "금융",
  "디자인",
  "임베디드",
  "프론트엔드",
  "인프라",
  "시큐리티",
];

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();

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

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(newInterests);
    form.setValue("interest", newInterests.join(","), { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const interests =
        selectedInterests.length > 0
          ? selectedInterests
          : data.interest
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean);

      await register({
        email: data.email,
        id: data.id,
        password: data.password,
        interest: interests,
      });

      toast({
        title: "회원가입 성공",
        description: "환영합니다! 자동으로 로그인되었습니다.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description:
          error instanceof Error
            ? error.message
            : "회원가입 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
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
                        disabled={isLoading}
                      />
                    </FormControl>
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
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      4-20자 사이의 아이디를 입력해주세요.
                    </FormDescription>
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
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      8자 이상의 비밀번호를 입력해주세요.
                    </FormDescription>
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
                      <Input
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        {...field}
                        disabled={isLoading}
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {INTEREST_OPTIONS.map((interest) => (
                        <Button
                          key={interest}
                          type="button"
                          variant={
                            selectedInterests.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleInterest(interest)}
                          disabled={isLoading}
                          className="justify-start"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "회원가입 중..." : "회원가입"}
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
