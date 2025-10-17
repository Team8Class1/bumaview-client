"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIdleTimer } from "@/hooks/use-idle-timer";
import { useToast } from "@/hooks/use-toast";
import * as tokenManager from "@/lib/token-manager";
import { useAuthStore } from "@/stores/auth";

const IDLE_WARNING_TIME = 30 * 60 * 1000; // 30분 후 경고
// const AUTO_LOGOUT_TIME = 35 * 60 * 1000; // 35분 후 자동 로그아웃 (미사용)
const WARNING_COUNTDOWN = 5 * 60 * 1000; // 5분 경고

export function SessionManager() {
  const { isLoggedIn, logout } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  // 자동 로그아웃 처리
  const handleAutoLogout = useCallback(() => {
    setShowWarning(false);
    logout();

    toast({
      variant: "destructive",
      title: "자동 로그아웃",
      description: "비활성 상태로 인해 보안상 자동 로그아웃되었습니다.",
    });

    router.push("/login");
  }, [logout, router, toast]);

  // 세션 연장 처리
  const handleExtendSession = () => {
    setShowWarning(false);
    idleTimer.reset();

    toast({
      title: "세션 연장",
      description: "세션이 연장되었습니다.",
    });
  };

  const checkTokenExpiration = useCallback(() => {
    if (!isLoggedIn) return;

    if (tokenManager.isTokenExpiringSoon(10)) {
      // 10분 이내 만료
      if (!showWarning) {
        setShowWarning(true);
      }
    } else if (showWarning) {
      setShowWarning(false);
    }

    if (tokenManager.isTokenExpired()) {
      handleAutoLogout();
    }
  }, [isLoggedIn, showWarning, handleAutoLogout]);

  // 비활성 타이머 설정
  const idleTimer = useIdleTimer({
    timeout: IDLE_WARNING_TIME,
    onIdle: () => {
      if (isLoggedIn) {
        setShowWarning(true);
        setCountdown(WARNING_COUNTDOWN);
      }
    },
    onActive: () => {
      setShowWarning(false);
    },
    startManually: false,
  });

  // 토큰 만료 체크
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // 5분마다 체크
    return () => clearInterval(interval);
  }, [isLoggedIn, checkTokenExpiration]);

  // 경고 카운트다운
  useEffect(() => {
    if (!showWarning || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1000) {
          handleAutoLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, countdown, handleAutoLogout]);

  // 인증되지 않은 사용자에게는 아무것도 렌더링하지 않음
  if (!isLoggedIn) return null;

  const minutes = Math.floor(countdown / 60000);
  const seconds = Math.floor((countdown % 60000) / 1000);

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>세션 만료 경고</AlertDialogTitle>
          <AlertDialogDescription>
            비활성 상태가 감지되었습니다.
            <br />
            <strong className="text-destructive">
              {minutes}분 {seconds}초
            </strong>{" "}
            후 자동으로 로그아웃됩니다.
            <br />
            세션을 연장하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleAutoLogout}>
            로그아웃
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExtendSession}>
            세션 연장
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
