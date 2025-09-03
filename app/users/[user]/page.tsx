"use client";

import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

export default function UserPage() {
  const params = useParams();
  const username = params.user as string;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 rounded-full p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {decodeURIComponent(username)}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>2023년 3월 가입</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500">등록한 질문</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">28</div>
                <div className="text-sm text-gray-500">작성한 답변</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-500">받은 좋아요</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">관심 분야</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">TypeScript</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            사용자 프로필 상세 기능은 곧 출시될 예정입니다.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}