"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp, MessageCircle, Building, Calendar, Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Question } from "@/types/question";

export default function ProfileQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'likes' | 'views'>('recent');

  useEffect(() => {
    const loadQuestions = () => {
      setLoading(true);

      setTimeout(() => {
        const mockQuestions: Question[] = [
          {
            id: "1",
            question: "React의 useEffect 훅에 대해 설명해주세요",
            category: "front",
            company: "카카오",
            question_at: "2024",
            author: "현재사용자",
            tags: ["React", "Hooks", "Frontend"],
            createdAt: "2024-01-15T10:30:00Z",
            views: 234,
            likes: 45,
            replies: 12
          },
          {
            id: "2",
            question: "데이터베이스 정규화에 대해 설명해주세요",
            category: "back",
            company: "네이버",
            question_at: "2024",
            author: "현재사용자",
            tags: ["Database", "SQL", "Backend"],
            createdAt: "2024-01-10T09:15:00Z",
            views: 189,
            likes: 32,
            replies: 8
          },
          {
            id: "3",
            question: "매머리닝과 딥러닝의 차이점을 설명해주세요",
            category: "ai",
            company: "삼성전자",
            question_at: "2023",
            author: "현재사용자",
            tags: ["AI", "Machine Learning", "Deep Learning"],
            createdAt: "2024-01-05T13:20:00Z",
            views: 456,
            likes: 78,
            replies: 15
          }
        ];

        setQuestions(mockQuestions);
        setLoading(false);
      }, 800);
    };

    loadQuestions();
  }, []);

  const deleteQuestion = (questionId: string) => {
    if (confirm("정말 이 질문을 삭제하시겠습니까?")) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const filteredAndSortedQuestions = questions
    .filter(question =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/profile" className="hover:text-foreground">프로필</Link>
          <span>/</span>
          <span className="text-foreground font-medium">내 질문</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              내 질문
            </h1>
            <p className="text-muted-foreground mt-2">
              총 {filteredAndSortedQuestions.length}개의 등록된 질문
            </p>
          </div>
          <Button asChild>
            <Link href="/questions/create">
              <Plus className="h-4 w-4 mr-2" />
              새 질문 등록
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="내 질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'likes' | 'views')}
              className="px-3 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="likes">좋아요순</option>
              <option value="views">조회순</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">질문을 불러오는 중...</p>
          </div>
        ) : filteredAndSortedQuestions.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">검색 결과가 없습니다</p>
              <p className="text-muted-foreground">다른 키워드로 검색해보세요</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">아직 등록한 질문이 없습니다</p>
              <p className="text-muted-foreground mb-6">첫 면접 질문을 공유해보세요</p>
              <Button asChild>
                <Link href="/questions/create">
                  <Plus className="h-4 w-4 mr-2" />
                  첫 질문 등록하기
                </Link>
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            {filteredAndSortedQuestions.map((question) => (
              <div key={question.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <Link
                    href={`/questions/${question.id}`}
                    className="flex-1"
                  >
                    <h3 className="text-lg font-semibold text-foreground hover:text-blue-500 transition-colors line-clamp-2">
                      {question.question}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/questions/${question.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{question.company}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{question.question_at}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <span>등록: {new Date(question.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-md">
                    {question.category}
                  </div>
                  {question.tags && question.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/tags/${tag}`}
                      className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{question.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{question.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{question.replies}</span>
                    </div>
                  </div>

                  <div className="text-green-600 text-sm font-medium">
                    내가 작성
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}