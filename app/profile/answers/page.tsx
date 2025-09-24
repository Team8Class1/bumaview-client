"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Calendar, Edit, Trash2, Plus, Search, Filter, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  question: {
    id: string;
    title: string;
    company: string;
  };
}

export default function ProfileAnswersPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'likes'>('recent');

  useEffect(() => {
    const loadAnswers = () => {
      setLoading(true);

      setTimeout(() => {
        const mockAnswers: Answer[] = [
          {
            id: "1",
            content: "useEffect는 React의 Hook 중 하나로, 함수형 컴포넌트에서 side effect를 처리할 때 사용합니다. 주요 특징으로는 컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있고, 의존성 배열을 통해 언제 effect를 실행할지 제어할 수 있습니다.",
            createdAt: "2024-01-20T14:30:00Z",
            likes: 42,
            comments: 8,
            question: {
              id: "1",
              title: "React의 useEffect 훅에 대해 설명해주세요",
              company: "카카오"
            }
          },
          {
            id: "2",
            content: "데이터베이스 정규화는 데이터의 중복을 최소화하고 데이터 무결성을 보장하기 위한 프로세스입니다. 1NF, 2NF, 3NF 등의 단계를 거쳐 테이블을 더 효율적으로 설계합니다.",
            createdAt: "2024-01-18T11:20:00Z",
            likes: 28,
            comments: 5,
            question: {
              id: "2",
              title: "데이터베이스 정규화에 대해 설명해주세요",
              company: "네이버"
            }
          },
          {
            id: "3",
            content: "JavaScript 클로저는 내부 함수가 외부 함수의 변수에 접근할 수 있도록 하는 기능입니다. 이를 통해 데이터 은닉화와 상태 유지가 가능합니다.",
            createdAt: "2024-01-15T16:45:00Z",
            likes: 35,
            comments: 12,
            question: {
              id: "3",
              title: "JavaScript의 클로저에 대해 설명해주세요",
              company: "토스"
            }
          }
        ];

        setAnswers(mockAnswers);
        setLoading(false);
      }, 800);
    };

    loadAnswers();
  }, []);

  const deleteAnswer = (answerId: string) => {
    if (confirm("정말 이 답변을 삭제하시겠습니까?")) {
      setAnswers(prev => prev.filter(a => a.id !== answerId));
    }
  };

  const filteredAndSortedAnswers = answers
    .filter(answer =>
      answer.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answer.question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answer.question.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes':
          return b.likes - a.likes;
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
          <span className="text-foreground font-medium">내 답변</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              내 답변
            </h1>
            <p className="text-muted-foreground mt-2">
              총 {filteredAndSortedAnswers.length}개의 작성된 답변
            </p>
          </div>
          <Button asChild>
            <Link href="/questions">
              <Plus className="h-4 w-4 mr-2" />
              질문 답변하기
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="내 답변 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'likes')}
              className="px-3 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="likes">좋아요순</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">답변을 불러오는 중...</p>
          </div>
        ) : filteredAndSortedAnswers.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">검색 결과가 없습니다</p>
              <p className="text-muted-foreground">다른 키워드로 검색해보세요</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">아직 작성한 답변이 없습니다</p>
              <p className="text-muted-foreground mb-6">질문에 답변하여 지식을 공유해보세요</p>
              <Button asChild>
                <Link href="/questions">
                  <Plus className="h-4 w-4 mr-2" />
                  질문 둘러보기
                </Link>
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            {filteredAndSortedAnswers.map((answer) => (
              <div key={answer.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Question Context */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{answer.question.company}에서 받은 질문</p>
                      <Link href={`/questions/${answer.question.id}`} className="text-sm font-medium hover:text-blue-500 transition-colors">
                        {answer.question.title}
                      </Link>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/questions/${answer.question.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Answer Content */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground">내 답변</h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/answers/${answer.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAnswer(answer.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground line-clamp-3">
                    {answer.content}
                  </p>
                </div>

                {/* Stats and Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{answer.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{answer.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(answer.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/answers/${answer.id}`}>
                        답변 보기
                      </Link>
                    </Button>
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