"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SearchBar from "@/components/common/SearchBar";
import QuestionCard from "@/components/question/QuestionCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "@/types/question";
import Link from "next/link";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    company: "",
    year: "",
    sort: "recent"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const questionsPerPage = 10;

  // CSV 파싱 최적화
  const parseCSVLine = useCallback((line: string) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }, []);

  // CSV 데이터 로드 (한 번만)
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/interview.csv', {
          cache: 'force-cache',
        });
        const text = await response.text();
        const lines = text.split('\n');

        const csvQuestions = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = parseCSVLine(line);
            const [question, category, company, question_at] = values;
            return {
              id: (index + 1).toString(),
              question: question?.replace(/"/g, '') || '',
              category: category || '',
              company: company || '',
              question_at: question_at || '',
              likes: Math.floor(Math.random() * 50),
              views: Math.floor(Math.random() * 200) + 10,
              createdAt: question_at || '2023',
              author: '익명',
              tags: category ? [category] : [],
              replies: Math.floor(Math.random() * 20)
            };
          })
          .filter(q => q.question && q.question.trim() !== '');

        setAllQuestions(csvQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [parseCSVLine]); // parseCSVLine 의존성 추가

  // 필터링과 정렬을 메모이제이션
  const filteredAndSortedQuestions = useMemo(() => {
    if (!allQuestions.length) return [];

    let filtered = [...allQuestions];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(q => q.category === filters.category);
    }
    if (filters.company) {
      filtered = filtered.filter(q => q.company === filters.company);
    }

    // Apply sorting
    switch (filters.sort) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return filtered;
  }, [allQuestions, filters]);

  // 페이지네이션 적용
  useEffect(() => {
    setTotalQuestions(filteredAndSortedQuestions.length);

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const paginatedQuestions = filteredAndSortedQuestions.slice(startIndex, endIndex);

    setQuestions(paginatedQuestions);
  }, [filteredAndSortedQuestions, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.company, filters.sort]);

  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  return (
    <>
      <Head>
        <title>질문 둘러보기 | BumaView</title>
        <meta name="description" content="개발자 면접에서 실제로 받은 질문들을 둘러보고 답변을 준비하세요. 카테고리별, 회사별로 정리된 면접 질문 모음." />
        <meta name="keywords" content="면접 질문, 개발자 면접, 프로그래밍 질문, 코딩 면접, 기술 면접" />
        <link rel="canonical" href="https://bumaview.com/questions" />
      </Head>
      <div className="min-h-screen bg-background">
        <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              질문 둘러보기
            </h1>
            <p className="text-muted-foreground mt-2">
              총 {totalQuestions}개의 실제 면접 질문
            </p>
          </div>
          <Button asChild>
            <Link href="/questions/create">
              질문 등록하기
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <SearchBar className="mb-4" />
          
          <div className="flex flex-wrap gap-4">
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value === 'all' ? '' : value})}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="front">프론트엔드</SelectItem>
                <SelectItem value="back">백엔드</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="bank">금융</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.company} onValueChange={(value) => setFilters({...filters, company: value === 'all' ? '' : value})}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="회사" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
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
            <p className="text-muted-foreground mt-4">질문을 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.length > 0 ? (
              questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {totalQuestions}개 중 {((currentPage - 1) * questionsPerPage) + 1}-{Math.min(currentPage * questionsPerPage, totalQuestions)}개 표시
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

        <Footer />
      </div>
    </>
  );
}