import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          다른 페이지를 찾아보시거나 홈으로 돌아가세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>홈으로 돌아가기</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/questions" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>질문 탐색하기</span>
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}