"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SearchBar from "@/components/common/SearchBar";
import QuestionCard from "@/components/question/QuestionCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/question";
import { Grid, List, Filter } from "lucide-react";
import Link from "next/link";

const mockQuestions: Question[] = [
  {
    id: "1",
    question: "React에서 useEffect의 의존성 배열을 비워두면 어떻게 될까요?",
    category: "프론트엔드",
    company: "카카오",
    question_at: "2023",
    author: "익명",
    tags: ["React", "Hooks"],
    createdAt: "2024-01-15T10:30:00Z",
    views: 152,
    likes: 23,
    replies: 7
  },
  {
    id: "2", 
    question: "데이터베이스 정규화의 목적과 종류에 대해 설명해주세요.",
    category: "백엔드",
    company: "네이버",
    question_at: "2023",
    author: "익명",
    tags: ["Database", "SQL"],
    createdAt: "2024-01-14T15:20:00Z",
    views: 89,
    likes: 15,
    replies: 4
  },
  {
    id: "3",
    question: "CI/CD 파이프라인 구축 경험에 대해 설명해주세요.",
    category: "DevOps",
    company: "토스",
    question_at: "2024",
    author: "익명", 
    tags: ["DevOps", "CI/CD"],
    createdAt: "2024-01-13T09:15:00Z",
    views: 234,
    likes: 31,
    replies: 12
  },
  {
    id: "4",
    question: "머신러닝 모델의 과적합을 방지하는 방법은?",
    category: "AI/ML",
    company: "삼성전자",
    question_at: "2023",
    author: "익명",
    tags: ["AI", "ML", "Overfitting"],
    createdAt: "2024-01-12T14:45:00Z", 
    views: 178,
    likes: 27,
    replies: 9
  }
];

export default function QuestionListPage() {
  const [questions] = useState<Question[]>(mockQuestions);
  const [loading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState({
    category: "",
    company: "",
    year: "",
    sort: "recent"
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["프론트엔드", "백엔드", "DevOps", "AI/ML", "모바일", "데이터"];
  const companies = ["카카오", "네이버", "토스", "삼성전자", "LG전자", "현대자동차"];
  const years = ["2024", "2023", "2022", "2021"];

  const filteredQuestions = questions.filter(question => {
    return (
      (!filters.category || question.category === filters.category) &&
      (!filters.company || question.company === filters.company) &&
      (!filters.year || question.question_at === filters.year)
    );
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (filters.sort) {
      case "recent":
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      case "oldest":
        return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
      case "likes":
        return (b.likes || 0) - (a.likes || 0);
      case "views":
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              면접 질문 목록
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              총 {sortedQuestions.length}개의 질문
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/questions/create">
                질문 등록하기
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <SearchBar className="mb-4" />
          
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>필터</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Select value={filters.sort} onValueChange={(value) => setFilters({...filters, sort: value})}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
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

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value === 'all' ? '' : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">회사</label>
                  <Select value={filters.company} onValueChange={(value) => setFilters({...filters, company: value === 'all' ? '' : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {companies.map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">연도</label>
                  <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value === 'all' ? '' : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2">
                  {filters.category && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>{filters.category}</span>
                      <button onClick={() => setFilters({...filters, category: ""})}>×</button>
                    </Badge>
                  )}
                  {filters.company && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>{filters.company}</span>
                      <button onClick={() => setFilters({...filters, company: ""})}>×</button>
                    </Badge>
                  )}
                  {filters.year && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>{filters.year}</span>
                      <button onClick={() => setFilters({...filters, year: ""})}>×</button>
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFilters({category: "", company: "", year: "", sort: "recent"})}
                >
                  필터 초기화
                </Button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">질문을 불러오는 중...</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
            {sortedQuestions.length > 0 ? (
              sortedQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">검색 결과가 없습니다.</p>
                <Button asChild variant="outline">
                  <Link href="/questions/create">새 질문 등록하기</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>이전</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">다음</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}