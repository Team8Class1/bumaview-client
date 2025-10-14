"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { useToast } from "./use-toast";

/**
 * 어드민 권한이 필요한 페이지에서 사용하는 훅
 * 권한이 없으면 홈으로 리다이렉트
 */
export function useRequireAdmin() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // 로그인하지 않은 경우
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "접근 권한 없음",
        description: "로그인이 필요합니다.",
      });
      router.replace("/login");
      return;
    }

    // 어드민 권한이 없는 경우
    if (user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "접근 권한 없음",
        description: "관리자만 접근할 수 있습니다.",
      });
      router.replace("/");
    }
  }, [user, isAuthenticated, router, toast]);

  return {
    isAdmin: user?.role === "admin",
    isLoading: !user,
  };
}

