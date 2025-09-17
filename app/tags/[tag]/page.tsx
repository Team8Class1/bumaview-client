"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionCard from "@/components/question/QuestionCard";
import { Question } from "@/types/question";
import { Tag, Search, Filter, TrendingUp, BookOpen, Users, Hash, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TagStats {
  totalQuestions: number;
  totalUsers: number;
  weeklyGrowth: number;
  avgViews: number;
}

interface RelatedTag {
  name: string;
  count: number;
  trend: "up" | "down" | "stable";
}

const mockTaggedQuestions: Question[] = [
  {
    id: "1",
    question: "React에서 useEffect의 의존성 배열을 비워두면 어떻게 될까요?",
    category: "프론트엔드",
    company: "카카오",
    question_at: "2023",
    author: "김개발",
    tags: ["React", "Hooks", "useEffect"],
    createdAt: "2024-01-15T10:30:00Z",
    views: 152,
    likes: 23,
    replies: 7
  },
  {
    id: "2",
    question: "React의 상태 관리 라이브러리 비교 (Redux vs Zustand vs Recoil)",
    category: "프론트엔드",
    company: "네이버",
    question_at: "2024",
    author: "이프론트",
    tags: ["React", "State Management", "Redux"],
    createdAt: "2024-01-14T15:20:00Z",
    views: 298,
    likes: 45,
    replies: 12
  },
  {
    id: "3",
    question: "React 18의 Concurrent Features에 대해 설명해주세요",
    category: "프론트엔드",
    company: "토스",
    question_at: "2024",
    author: "박리액트",
    tags: ["React", "Concurrent", "Performance"],
    createdAt: "2024-01-13T09:15:00Z",
    views: 187,
    likes: 31,
    replies: 9
  },
  {
    id: "4",
    question: "Custom Hook을 만들 때 주의해야 할 점들",
    category: "프론트엔드",
    company: "라인",
    question_at: "2023",
    author: "최훅스",
    tags: ["React", "Custom Hooks", "Best Practices"],
    createdAt: "2024-01-12T14:45:00Z", 
    views: 124,
    likes: 19,
    replies: 6
  },
  {
    id: "5",
    question: "React Query vs SWR 어떤 것을 선택해야 할까요?",
    category: "프론트엔드",
    company: "우아한형제들",
    question_at: "2024",
    author: "김데이터",
    tags: ["React", "Data Fetching", "React Query"],
    createdAt: "2024-01-11T11:30:00Z",
    views: 205,
    likes: 28,
    replies: 11
  }
];

const mockTagStats: TagStats = {
  totalQuestions: 47,
  totalUsers: 23,
  weeklyGrowth: 12,
  avgViews: 186
};

const mockRelatedTags: RelatedTag[] = [
  { name: "JavaScript", count: 156, trend: "up" },
  { name: "TypeScript", count: 89, trend: "up" },
  { name: "Next.js", count: 67, trend: "stable" },
  { name: "Hooks", count: 45, trend: "up" },
  { name: "State Management", count: 34, trend: "stable" },
  { name: "Performance", count: 23, trend: "down" }
];

export default function TagPage() {
  const params = useParams();
  const tagName = decodeURIComponent(params.tag as string);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tagStats, setTagStats] = useState<TagStats | null>(null);
  const [relatedTags, setRelatedTags] = useState<RelatedTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const loadTagData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter questions that contain the tag
      const filteredQuestions = mockTaggedQuestions.filter(q => 
        q.tags?.some(tag => tag.toLowerCase().includes(tagName.toLowerCase()))
      );
      
      setQuestions(filteredQuestions);
      setTagStats(mockTagStats);
      setRelatedTags(mockRelatedTags);
      setLoading(false);
    };
    
    loadTagData();
  }, [tagName]);

  const filteredQuestions = questions.filter(question =>
    searchTerm === "" || 
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">태그 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/questions" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>질문 목록으로</span>
            </Link>
          </Button>
        </div>

        {/* 태그 헤더 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Hash className="h-6 w-6 text-blue-600" />
              <Badge variant="secondary" className="text-xl px-4 py-2">
                {tagName}
              </Badge>
            </div>
            {tagStats && (
              <span className="text-gray-500">
                {tagStats.totalQuestions}개의 질문
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            &apos;{tagName}&apos; 태그 관련 질문들
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {tagName} 기술과 관련된 면접 질문들을 모아보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 검색 및 필터 */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="질문 내용이나 작성자로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span>필터</span>
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
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
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">카테고리</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="전체" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value="frontend">프론트엔드</SelectItem>
                            <SelectItem value="backend">백엔드</SelectItem>
                            <SelectItem value="mobile">모바일</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">회사</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="전체" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value="kakao">카카오</SelectItem>
                            <SelectItem value="naver">네이버</SelectItem>
                            <SelectItem value="toss">토스</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">난이도</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="전체" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value="easy">쉬움</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="hard">어려움</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 질문 목록 */}
            <div className="space-y-4">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      다른 검색어를 시도해보거나 필터를 조정해보세요
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/questions/create">새 질문 등록하기</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            {/* 태그 통계 */}
            {tagStats && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">태그 통계</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">총 질문</span>
                    </div>
                    <span className="font-bold text-blue-600">{tagStats.totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm">참여자</span>
                    </div>
                    <span className="font-bold text-green-600">{tagStats.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">주간 증가</span>
                    </div>
                    <span className="font-bold text-purple-600">+{tagStats.weeklyGrowth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">평균 조회수</span>
                    <span className="font-bold">{tagStats.avgViews}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 관련 태그 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관련 태그</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedTags.map((relatedTag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Link 
                        href={`/tags/${relatedTag.name}`}
                        className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      >
                        <Badge variant="outline" className="text-xs">
                          {relatedTag.name}
                        </Badge>
                        <span className="text-sm text-gray-500">{relatedTag.count}</span>
                      </Link>
                      <div className="flex items-center">
                        {relatedTag.trend === "up" && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {relatedTag.trend === "down" && (
                          <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                        )}
                        {relatedTag.trend === "stable" && (
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  더 많은 태그 보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}