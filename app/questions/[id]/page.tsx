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


export default function QuestionDetailPage() {
  const params = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [relatedQuestions, setRelatedQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<MockAnswer[]>([]);
  const [replies, setReplies] = useState<MockReply[]>([]);
  const [replyTexts, setReplyTexts] = useState<{ [answerId: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [answerId: string]: boolean }>({});
  const [userName, setUserName] = useState("익명 사용자");

  // localStorage 유틸리티 함수들
  const saveAnswersToStorage = (questionId: string, answersData: MockAnswer[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`answers_${questionId}`, JSON.stringify(answersData));
    }
  };

  const loadAnswersFromStorage = (questionId: string): MockAnswer[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`answers_${questionId}`);
      if (stored) {
        return JSON.parse(stored).map((answer: MockAnswer & { createdAt: string }) => ({
          ...answer,
          createdAt: new Date(answer.createdAt)
        }));
      }
    }
    return []; // 빈 배열로 시작
  };

  const saveRepliesToStorage = (questionId: string, repliesData: MockReply[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`replies_${questionId}`, JSON.stringify(repliesData));
    }
  };

  const loadRepliesFromStorage = (questionId: string): MockReply[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`replies_${questionId}`);
      if (stored) {
        return JSON.parse(stored).map((reply: MockReply & { createdAt: string }) => ({
          ...reply,
          createdAt: new Date(reply.createdAt)
        }));
      }
    }
    return []; // 빈 배열로 시작
  };

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);

        // Load questions from CSV
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
              author: '익명',
              tags: category ? [category] : [],
              createdAt: question_at || '2023',
              views: Math.floor(Math.random() * 500) + 50,
              likes: Math.floor(Math.random() * 50) + 5,
              replies: Math.floor(Math.random() * 10) + 1
            };
          })
          .filter(q => q.question && q.question.trim() !== '');

        // Find the specific question by ID
        const questionId = params.id as string;
        const foundQuestion = csvQuestions.find(q => q.id === questionId);

        if (foundQuestion) {
          setQuestion(foundQuestion);

          // Find related questions (same category or company)
          const related = csvQuestions
            .filter(q =>
              q.id !== questionId &&
              (q.category === foundQuestion.category || q.company === foundQuestion.company)
            )
            .slice(0, 5);
          setRelatedQuestions(related);

          // Load answers and replies from localStorage
          const savedAnswers = loadAnswersFromStorage(questionId);
          const savedReplies = loadRepliesFromStorage(questionId);

          setAnswers(savedAnswers);
          setReplies(savedReplies);

          // Update question replies count based on saved answers
          const totalReplies = savedAnswers.length;

          // Load saved likes count
          let savedLikes = foundQuestion.likes || 0;
          if (typeof window !== 'undefined') {
            const storedLikes = localStorage.getItem(`question_likes_${questionId}`);
            if (storedLikes) {
              savedLikes = parseInt(storedLikes);
            }
          }

          setQuestion({
            ...foundQuestion,
            replies: totalReplies,
            likes: savedLikes
          });
        } else {
          setQuestion(null);
        }
      } catch (error) {
        console.error('Failed to load question:', error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [params.id]);

  // 사용자 이름 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName) {
        setUserName(savedUserName);
      }
    }
  }, []);

  const handleSubmitAnswer = () => {
    if (!answer.trim() || !question) return;

    const newAnswer: MockAnswer = {
      id: Date.now().toString(), // 유니크한 ID 생성
      author: userName,
      level: "사용자",
      content: answer,
      likes: 0,
      replies: 0,
      createdAt: new Date(),
      isBest: false
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setAnswer("");

    // localStorage에 저장
    saveAnswersToStorage(question.id, updatedAnswers);

    // 질문 답변 수 업데이트
    const updatedQuestion = {
      ...question,
      replies: updatedAnswers.length
    };
    setQuestion(updatedQuestion);
  };

  const handleLikeAnswer = (answerId: string) => {
    if (!question) return;

    const updatedAnswers = answers.map(ans =>
      ans.id === answerId
        ? { ...ans, likes: ans.likes + 1 }
        : ans
    );
    setAnswers(updatedAnswers);

    // localStorage에 저장
    saveAnswersToStorage(question.id, updatedAnswers);
  };

  const handleSubmitReply = (answerId: string) => {
    const replyText = replyTexts[answerId];
    if (!replyText?.trim() || !question) return;

    const newReply: MockReply = {
      id: Date.now().toString(), // 유니크한 ID 생성
      answerId,
      author: userName,
      content: replyText,
      likes: 0,
      createdAt: new Date()
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);

    const updatedAnswers = answers.map(ans =>
      ans.id === answerId
        ? { ...ans, replies: ans.replies + 1 }
        : ans
    );
    setAnswers(updatedAnswers);

    // localStorage에 저장
    saveRepliesToStorage(question.id, updatedReplies);
    saveAnswersToStorage(question.id, updatedAnswers);

    setReplyTexts({ ...replyTexts, [answerId]: "" });
    setShowReplyForm({ ...showReplyForm, [answerId]: false });
  };

  const handleLikeReply = (replyId: string) => {
    if (!question) return;

    const updatedReplies = replies.map(reply =>
      reply.id === replyId
        ? { ...reply, likes: reply.likes + 1 }
        : reply
    );
    setReplies(updatedReplies);

    // localStorage에 저장
    saveRepliesToStorage(question.id, updatedReplies);
  };

  const handleLikeQuestion = () => {
    if (!question) return;

    const updatedQuestion = {
      ...question,
      likes: question.likes ? question.likes + 1 : 1
    };
    setQuestion(updatedQuestion);

    // localStorage에 질문 좋아요 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(`question_likes_${question.id}`, updatedQuestion.likes.toString());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">질문을 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">질문을 찾을 수 없습니다.</p>
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
    <div className="min-h-screen bg-background">
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
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{question.company}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{question.question_at}</span>
                </div>
              </div>
              <Badge variant="secondary">{question.category}</Badge>
            </div>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLikeQuestion}
                >
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
            <div className="flex items-center space-x-2 mb-4">
              <label className="text-sm font-medium">닉네임:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('userName', e.target.value);
                  }
                }}
                className="border border-border rounded px-2 py-1 text-sm bg-background"
                placeholder="닉네임을 입력하세요"
              />
            </div>
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
            {answers.length > 0 ? (
              <div className="space-y-6">
                {answers.map((answer, index) => (
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-blue-500"
                              onClick={() => handleLikeAnswer(answer.id)}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {answer.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              신고
                            </Button>
                          </div>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-foreground">
                            {answer.content}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLikeAnswer(answer.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            도움됨
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowReplyForm({
                              ...showReplyForm,
                              [answer.id]: !showReplyForm[answer.id]
                            })}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            댓글 ({answer.replies})
                          </Button>
                          <Button variant="ghost" size="sm">
                            공유
                          </Button>
                        </div>
                        
                        {/* 댓글 섹션 */}
                        {answer.replies > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-border">
                            <div className="space-y-3">
                              {replies.filter(reply => reply.answerId === answer.id).map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                    {reply.author.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-sm">{reply.author}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {reply.createdAt.toLocaleDateString('ko-KR')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground">{reply.content}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-6 px-2"
                                        onClick={() => handleLikeReply(reply.id)}
                                      >
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

                        {/* 댓글 작성 폼 */}
                        {showReplyForm[answer.id] && (
                          <div className="mt-4 pl-4 border-l-2 border-border">
                            <div className="space-y-3">
                              <Textarea
                                placeholder="댓글을 작성해주세요..."
                                value={replyTexts[answer.id] || ""}
                                onChange={(e) => setReplyTexts({
                                  ...replyTexts,
                                  [answer.id]: e.target.value
                                })}
                                className="min-h-[80px]"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSubmitReply(answer.id)}
                                  disabled={!replyTexts[answer.id]?.trim()}
                                >
                                  댓글 등록
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowReplyForm({
                                    ...showReplyForm,
                                    [answer.id]: false
                                  })}
                                >
                                  취소
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>관련 질문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedQuestions.map((relatedQ) => (
                  <Link
                    key={relatedQ.id}
                    href={`/questions/${relatedQ.id}`}
                    className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                          {relatedQ.question}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{relatedQ.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{relatedQ.question_at}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{relatedQ.views}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {relatedQ.category}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/questions">더 많은 질문 보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}