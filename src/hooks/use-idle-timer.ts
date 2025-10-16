import { useEffect, useRef, useState } from "react";

interface UseIdleTimerProps {
  timeout: number; // 비활성 시간 (밀리초)
  onIdle: () => void; // 비활성 상태일 때 호출되는 콜백
  onActive?: () => void; // 활성 상태로 돌아올 때 호출되는 콜백
  events?: string[]; // 감지할 이벤트들
  startManually?: boolean; // 수동으로 시작할지 여부
}

const DEFAULT_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];

export function useIdleTimer({
  timeout,
  onIdle,
  onActive,
  events = DEFAULT_EVENTS,
  startManually = false,
}: UseIdleTimerProps) {
  const [isIdle, setIsIdle] = useState(false);
  const [isRunning, setIsRunning] = useState(!startManually);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = () => {
    if (!isRunning) return;

    lastActivityRef.current = Date.now();

    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  };

  const start = () => {
    setIsRunning(true);
    resetTimer();
  };

  const stop = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    if (isRunning) {
      resetTimer();
    }
  };

  const getLastActivityTime = () => lastActivityRef.current;
  const getRemainingTime = () => {
    if (!isRunning) return timeout;
    const elapsed = Date.now() - lastActivityRef.current;
    return Math.max(0, timeout - elapsed);
  };

  useEffect(() => {
    if (!isRunning) return;

    const handleActivity = () => resetTimer();

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // 초기 타이머 설정
    resetTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isRunning,
    events, // 초기 타이머 설정
    resetTimer,
  ]);

  return {
    isIdle,
    isRunning,
    start,
    stop,
    reset,
    getLastActivityTime,
    getRemainingTime,
  };
}
