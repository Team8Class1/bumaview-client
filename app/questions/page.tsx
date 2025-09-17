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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/interview.csv');
        const text = await response.text();
        const lines = text.split('\n');

        const csvQuestions = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            // Simple CSV parsing - handle quotes properly
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

        let filteredQuestions = [...csvQuestions];

        // Apply filters
        if (filters.category) {
          filteredQuestions = filteredQuestions.filter(q => q.category === filters.category);
        }
        if (filters.company) {
          filteredQuestions = filteredQuestions.filter(q => q.company === filters.company);
        }

        // Apply sorting
        switch (filters.sort) {
          case 'oldest':
            filteredQuestions.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            break;
          case 'likes':
            filteredQuestions.sort((a, b) => b.likes - a.likes);
            break;
          case 'views':
            filteredQuestions.sort((a, b) => b.views - a.views);
            break;
          case 'recent':
          default:
            filteredQuestions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            break;
        }

        setQuestions(filteredQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
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
      </main>
      
      <Footer />
    </div>
  );
}