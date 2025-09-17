"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/question";
import { ThumbsUp, MessageCircle, Eye, Building, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MockAnswer {
  id: string;
  author: string;
  level: string;
  content: string;
  likes: number;
  replies: number;
  createdAt: Date;
  isBest: boolean;
}

interface MockReply {
  id: string;
  answerId: string;
  author: string;
  content: string;
  likes: number;
  createdAt: Date;
}

const mockAnswers: MockAnswer[] = [
  {
    id: "1",
    author: "김개발",
    level: "시니어 개발자",
    content: "useEffect의 의존성 배열을 비워두면([]) 컴포넌트가 마운트될 때 한 번만 실행됩니다.\n\n이는 클래스형 컴포넌트의 componentDidMount와 동일한 동작을 합니다.\n\n주요 사용 사례:\n1. API 호출\n2. 이벤트 리스너 등록\n3. 타이머 설정\n4. 외부 라이브러리 초기화\n\n주의사항:\n- 클린업 함수를 반환하면 componentWillUnmount와 같은 역할\n- 의존성 배열을 완전히 생략하면 매 렌더링마다 실행됨\n- ESLint 규칙을 따라 필요한 의존성은 모두 포함해야 함",
    likes: 23,
    replies: 3,
    createdAt: new Date("2024-01-15T14:30:00Z"),
    isBest: true
  },
  {
    id: "2",
    author: "이프론트",
    level: "주니어 개발자",
    content: "간단히 말하면 컴포넌트가 처음 렌더될 때만 실행됩니다!\n\n예시 코드:\n```javascript\nuseEffect(() => {\n  console.log('컴포넌트가 마운트되었습니다');\n  \n  return () => {\n    console.log('컴포넌트가 언마운트됩니다');\n  };\n}, []); // 빈 배열이 핵심!\n```\n\n실무에서 자주 사용하는 패턴이에요.",
    likes: 8,
    replies: 1,
    createdAt: new Date("2024-01-15T16:45:00Z"),
    isBest: false
  }
];

const mockReplies: MockReply[] = [
  {
    id: "1",
    answerId: "1",
    author: "박질문",
    content: "정말 자세한 설명 감사합니다! 클린업 함수 부분이 특히 도움이 되었어요.",
    likes: 5,
    createdAt: new Date("2024-01-15T15:00:00Z")
  },
  {
    id: "2",
    answerId: "1",
    author: "최초보",
    content: "componentDidMount와 비교해주신 부분이 이해하기 쉬웠습니다!",
    likes: 2,
    createdAt: new Date("2024-01-15T15:30:00Z")
  },
  {
    id: "3",
    answerId: "1",
    author: "김궁금",
    content: "의존성 배열을 아예 생략하는 것과 빈 배열로 두는 것의 차이점을 더 자세히 알고 싶어요.",
    likes: 1,
    createdAt: new Date("2024-01-15T16:00:00Z")
  },
  {
    id: "4",
    answerId: "2",
    author: "이감사",
    content: "코드 예시가 정말 이해하기 쉽네요!",
    likes: 3,
    createdAt: new Date("2024-01-15T17:00:00Z")
  }
];

export default function QuestionDetailPage() {
  const params = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        // Mock question data since we don't have individual question API yet
        const mockQuestion: Question = {
          id: params.id as string,
          question: "React에서 useEffect의 의존성 배열을 비워두면 어떻게 될까요?",
          category: "front",
          company: "카카오",
          question_at: "2023",
          author: "익명",
          tags: ["React", "Hooks"],
          createdAt: "2024-01-15T10:30:00Z",
          views: 152,
          likes: 23,
          replies: 2
        };
        setQuestion(mockQuestion);
      } catch (error) {
        console.error('Failed to load question:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [params.id]);

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    // Mock answer submission
    console.log('Answer submitted:', answer);
    setAnswer("");
    alert('답변이 등록되었습니다!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">질문을 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">질문을 찾을 수 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/questions">질문 목록으로 돌아가기</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Building className="h-4 w-4" />
                  <span>{question.company}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{question.question_at}</span>
                </div>
              </div>
              <Badge variant="secondary">{question.category}</Badge>
            </div>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  좋아요
                </Button>
                <Button variant="outline" size="sm">
                  공유하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>답변 작성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="이 질문에 대한 답변을 작성해주세요..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitAnswer} disabled={!answer.trim()}>
                답변 등록
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>답변 목록 ({question.replies})</CardTitle>
          </CardHeader>
          <CardContent>
            {mockAnswers.length > 0 ? (
              <div className="space-y-6">
                {mockAnswers.map((answer, index) => (
                  <div key={answer.id} id={`answer-${answer.id}`} className={`${index > 0 ? 'border-t pt-6' : ''}`}>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {answer.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{answer.author}</span>
                            <Badge variant={answer.isBest ? "default" : "secondary"} className="text-xs">
                              {answer.isBest ? "베스트 답변" : answer.level}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {answer.createdAt.toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {answer.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              신고
                            </Button>
                          </div>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                            {answer.content}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            도움됨
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            댓글 ({answer.replies})
                          </Button>
                          <Button variant="ghost" size="sm">
                            공유
                          </Button>
                        </div>
                        
                        {/* 댓글 섹션 */}
                        {answer.replies > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                              {mockReplies.filter(reply => reply.answerId === answer.id).map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                                    {reply.author.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-sm">{reply.author}</span>
                                      <span className="text-xs text-gray-500">
                                        {reply.createdAt.toLocaleDateString('ko-KR')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                        <ThumbsUp className="h-3 w-3 mr-1" />
                                        {reply.likes}
                                      </Button>
                                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                        답글
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3">
                              <Button variant="ghost" size="sm" className="text-blue-600">
                                댓글 더보기
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}