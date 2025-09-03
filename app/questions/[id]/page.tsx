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

export default function QuestionDetailPage() {
  const params = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, [params.id]);

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
        replies: 7
      };
      setQuestion(mockQuestion);
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}