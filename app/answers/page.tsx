"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Answer } from "@/types/answer";
import { ThumbsUp, MessageCircle, User, Calendar, Search, Filter, Star } from "lucide-react";
import Link from "next/link";

interface AnswerWithQuestion extends Answer {
  question: {
    id: string;
    title: string;
    category: string;
    company: string;
  };
  author: {
    name: string;
    avatar?: string;
    level: string;
  };
  likes: number;
  replies: number;
  isBestAnswer: boolean;
}

const mockAnswers: AnswerWithQuestion[] = [
  {
    id: "1",
    questionId: "1",
    userId: "user1",
    content: "useEffect의 의존성 배열을 비워두면 컴포넌트가 마운트될 때 한 번만 실행됩니다. 이는 componentDidMount와 유사한 동작을 합니다. 주로 API 호출이나 이벤트 리스너 등록 등 초기 설정에 사용됩니다.\n\n```javascript\nuseEffect(() => {\n  // 마운트 시에만 실행\n  fetchData();\n}, []); // 빈 배열\n```\n\n주의할 점은 의존성 배열을 잘못 설정하면 stale closure 문제가 발생할 수 있다는 것입니다.",
    createdAt: new Date("2024-01-15T14:30:00Z"),
    updatedAt: new Date("2024-01-15T14:30:00Z"),
    question: {
      id: "1",
      title: "React에서 useEffect의 의존성 배열을 비워두면 어떻게 될까요?",
      category: "프론트엔드",
      company: "카카오"
    },
    author: {
      name: "김개발",
      avatar: "https://ui-avatars.com/api/?name=김개발&background=3B82F6&color=fff",
      level: "시니어"
    },
    likes: 23,
    replies: 7,
    isBestAnswer: true
  },
  {
    id: "2",
    questionId: "2", 
    userId: "user2",
    content: "데이터베이스 정규화는 데이터의 중복을 최소화하고 무결성을 보장하기 위한 과정입니다.\n\n**정규화의 목적:**\n- 데이터 중복 제거\n- 데이터 무결성 보장\n- 저장 공간 효율성\n- 갱신 이상 방지\n\n**정규화 단계:**\n1. 1NF: 원자값만 저장\n2. 2NF: 부분 함수 종속 제거\n3. 3NF: 이행 함수 종속 제거\n4. BCNF: 결정자가 후보키가 아닌 함수 종속 제거\n\n실무에서는 3NF까지 적용하는 것이 일반적입니다.",
    createdAt: new Date("2024-01-14T09:20:00Z"),
    updatedAt: new Date("2024-01-14T09:20:00Z"),
    question: {
      id: "2",
      title: "데이터베이스 정규화의 목적과 종류에 대해 설명해주세요.",
      category: "백엔드",
      company: "네이버"
    },
    author: {
      name: "이디비",
      avatar: "https://ui-avatars.com/api/?name=이디비&background=10B981&color=fff",
      level: "리드"
    },
    likes: 15,
    replies: 4,
    isBestAnswer: false
  },
  {
    id: "3",
    questionId: "3",
    userId: "user3",
    content: "CI/CD 파이프라인 구축 경험을 공유드리겠습니다.\n\n**사용한 도구들:**\n- Jenkins for CI/CD orchestration\n- Docker for containerization\n- Kubernetes for deployment\n- SonarQube for code quality\n- Slack for notifications\n\n**파이프라인 구성:**\n1. 코드 푸시 → GitHub webhook\n2. 자동 빌드 및 테스트\n3. 코드 품질 검사\n4. Docker 이미지 빌드\n5. Staging 환경 배포\n6. 수동 승인 후 Production 배포\n\n이를 통해 배포 시간을 2시간에서 10분으로 단축했습니다.",
    createdAt: new Date("2024-01-13T16:45:00Z"),
    updatedAt: new Date("2024-01-13T16:45:00Z"),
    question: {
      id: "3",
      title: "CI/CD 파이프라인 구축 경험에 대해 설명해주세요.",
      category: "DevOps",
      company: "토스"
    },
    author: {
      name: "박데브옵스",
      avatar: "https://ui-avatars.com/api/?name=박데브옵스&background=8B5CF6&color=fff",
      level: "시니어"
    },
    likes: 31,
    replies: 12,
    isBestAnswer: true
  }
];

export default function AnswersPage() {
  const [answers] = useState<AnswerWithQuestion[]>(mockAnswers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["프론트엔드", "백엔드", "DevOps", "AI/ML", "모바일", "데이터"];

  const filteredAnswers = answers.filter(answer => {
    const matchesSearch = 
      answer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || answer.question.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedAnswers = [...filteredAnswers].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "likes":
        return b.likes - a.likes;
      case "replies":
        return b.replies - a.replies;
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
              공개 답변 목록
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              커뮤니티에서 공유된 우수한 답변들을 확인하세요
            </p>
          </div>
          <Button asChild>
            <Link href="/questions">
              질문 둘러보기
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="답변 내용이나 질문으로 검색..."
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                  <SelectItem value="likes">좋아요순</SelectItem>
                  <SelectItem value="replies">댓글순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
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
                  <label className="block text-sm font-medium mb-2">답변 유형</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="best">베스트 답변</SelectItem>
                      <SelectItem value="verified">인증된 답변</SelectItem>
                      <SelectItem value="detailed">상세 답변</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {sortedAnswers.map((answer) => (
            <Card key={answer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {answer.isBestAnswer && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          <Star className="h-3 w-3 mr-1" />
                          베스트 답변
                        </Badge>
                      )}
                      <Badge variant="outline">{answer.question.category}</Badge>
                      <Badge variant="secondary">{answer.question.company}</Badge>
                    </div>
                    <CardTitle className="text-lg">
                      <Link 
                        href={`/questions/${answer.questionId}`}
                        className="hover:text-blue-600 line-clamp-2"
                      >
                        {answer.question.title}
                      </Link>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 line-clamp-4">
                      {answer.content}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    <Link href={`/questions/${answer.questionId}#answer-${answer.id}`}>
                      전체 답변 보기
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{answer.author.name}</div>
                        <div className="text-xs text-gray-500">{answer.author.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{answer.createdAt.toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{answer.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{answer.replies}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      도움됨
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedAnswers.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              다른 키워드로 검색해보거나 직접 답변을 작성해보세요
            </p>
            <Button asChild variant="outline">
              <Link href="/questions">질문 둘러보기</Link>
            </Button>
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