"use client";

import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Badge } from "@/components/ui/badge";

export default function TagPage() {
  const params = useParams();
  const tag = params.tag as string;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {decodeURIComponent(tag)}
            </Badge>
            <span className="text-gray-500">관련 질문 12개</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            '{decodeURIComponent(tag)}' 태그 질문들
          </h1>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            태그별 질문 기능은 곧 출시될 예정입니다.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}