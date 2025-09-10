"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SearchBar from "@/components/common/SearchBar";
import QuestionCard from "@/components/question/QuestionCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question } from "@/types/question";
import Link from "next/link";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    company: "",
    year: "",
    sort: "recent"
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.company) params.append('company', filters.company);
      if (filters.year) params.append('year', filters.year);
      params.append('sort', filters.sort);
      
      const response = await fetch(`/api/questions?${params}`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [filters, loadQuestions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            면접 질문 목록
          </h1>
          <Button asChild>
            <Link href="/questions/create">
              질문 등록하기
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <SearchBar className="mb-4" />
          
          <div className="flex flex-wrap gap-4">
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="front">프론트엔드</SelectItem>
                <SelectItem value="back">백엔드</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="bank">금융</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.company} onValueChange={(value) => setFilters({...filters, company: value})}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="회사" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="마이다스IT">마이다스IT</SelectItem>
                <SelectItem value="신한은행">신한은행</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={(value) => setFilters({...filters, sort: value})}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="likes">좋아요순</SelectItem>
                <SelectItem value="views">조회순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">질문을 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.length > 0 ? (
              questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}