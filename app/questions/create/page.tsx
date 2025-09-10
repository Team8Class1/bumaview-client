"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateQuestionPage() {
  const [formData, setFormData] = useState({
    question: "",
    category: "",
    company: "",
    year: "2024"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.category || !formData.company) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("질문이 등록되었습니다!");
      setFormData({
        question: "",
        category: "",
        company: "",
        year: "2024"
      });
    } catch {
      alert("질문 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/questions" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>질문 목록으로</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>새 질문 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  질문 내용 *
                </label>
                <Textarea
                  id="question"
                  placeholder="면접에서 받은 질문을 정확히 입력해주세요..."
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    카테고리 *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">프론트엔드</SelectItem>
                      <SelectItem value="back">백엔드</SelectItem>
                      <SelectItem value="ai">AI/ML</SelectItem>
                      <SelectItem value="mobile">모바일</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="data">데이터</SelectItem>
                      <SelectItem value="bank">금융</SelectItem>
                      <SelectItem value="game">게임</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    회사명 *
                  </label>
                  <Input
                    id="company"
                    placeholder="회사명 입력"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    면접 연도 *
                  </label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  질문 등록 가이드라인
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 실제 면접에서 받은 질문을 정확히 기입해주세요</li>
                  <li>• 개인정보나 민감한 정보는 제외해주세요</li>
                  <li>• 질문의 맥락이나 배경이 있다면 함께 적어주세요</li>
                  <li>• 중복된 질문이 있는지 먼저 검색해보세요</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/questions">취소</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "등록 중..." : "질문 등록"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}