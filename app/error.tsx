"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          오류가 발생했습니다
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          죄송합니다. 예상하지 못한 오류가 발생했습니다.
          다시 시도해보시거나 홈페이지로 돌아가세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>다시 시도</span>
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            <Home className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-gray-500 mt-4">
            오류 ID: {error.digest}
          </p>
        )}
      </Card>
    </div>
  );
}