"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, MessageCircle, Calendar, User, Send } from "lucide-react";
import Link from "next/link";

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  question: {
    id: string;
    title: string;
    company: string;
  };
}

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

export default function AnswerDetailPage() {
  const params = useParams();
  const answerId = params.id as string;

  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedAnswer, setLikedAnswer] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadAnswer = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with real API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockAnswer: Answer = {
          id: answerId,
          content: "useEffect는 React의 Hook 중 하나로, 함수형 컴포넌트에서 side effect를 처리할 때 사용합니다.\n\n주요 특징:\n1. 컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있습니다\n2. 의존성 배열을 통해 언제 effect를 실행할지 제어할 수 있습니다\n3. cleanup 함수를 반환하여 정리 작업을 할 수 있습니다\n\n사용 예시:\n```javascript\nuseEffect(() => {\n  // effect 로직\n  return () => {\n    // cleanup 로직\n  };\n}, [dependency]);\n```\n\n의존성 배열의 동작:\n- 빈 배열 []: 컴포넌트 마운트 시에만 실행\n- 배열 없음: 매 렌더링마다 실행\n- [value]: value가 변경될 때만 실행",
          author: "React전문가",
          createdAt: "2024-01-20T10:30:00Z",
          likes: 42,
          question: {
            id: "1",
            title: "React의 useEffect 훅에 대해 설명해주세요",
            company: "카카오"
          },
          comments: [
            {
              id: "1",
              content: "정말 명확하고 이해하기 쉬운 설명이네요! 감사합니다.",
              author: "학습자1",
              createdAt: "2024-01-20T11:00:00Z",
              likes: 8
            },
            {
              id: "2",
              content: "cleanup 함수에 대한 부분이 특히 도움이 되었습니다.",
              author: "개발자A",
              createdAt: "2024-01-20T14:15:00Z",
              likes: 5
            }
          ]
        };

        setAnswer(mockAnswer);
      } catch (error) {
        console.error('Failed to load answer:', error);
        alert('답변을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (answerId) {
      loadAnswer();
    }
  }, [answerId]);

  const handleLikeAnswer = () => {
    setLikedAnswer(prev => !prev);
    if (answer) {
      setAnswer(prev => prev ? {
        ...prev,
        likes: likedAnswer ? prev.likes - 1 : prev.likes + 1
      } : null);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const newLikedComments = new Set(likedComments);
    const wasLiked = likedComments.has(commentId);
    
    if (wasLiked) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
    }
    
    setLikedComments(newLikedComments);
    
    if (answer) {
      setAnswer(prev => prev ? {
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: wasLiked ? comment.likes - 1 : comment.likes + 1 }
            : comment
        )
      } : null);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: "현재사용자",
        createdAt: new Date().toISOString(),
        likes: 0
      };

      if (answer) {
        setAnswer(prev => prev ? {
          ...prev,
          comments: [...prev.comments, newCommentObj]
        } : null);
      }
      
      setNewComment("");
      alert("댓글이 등록되었습니다!");
    } catch (error) {
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">답변을 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">답변을 찾을 수 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/questions">질문 목록으로</Link>
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
            <Link href={`/questions/${answer.question.id}`} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>질문으로 돌아가기</span>
            </Link>
          </Button>
        </div>

        {/* Question Context */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">
              {answer.question.company}에서 받은 질문
            </div>
            <Link href={`/questions/${answer.question.id}`} className="hover:text-blue-500">
              <h2 className="text-lg font-semibold">{answer.question.title}</h2>
            </Link>
          </CardContent>
        </Card>

        {/* Answer */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {answer.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{answer.author}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(answer.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </div>
              <Button
                variant={likedAnswer ? "default" : "outline"}
                size="sm"
                onClick={handleLikeAnswer}
                className="flex items-center space-x-1"
              >
                <Heart className={`h-4 w-4 ${likedAnswer ? 'fill-current' : ''}`} />
                <span>{answer.likes}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {answer.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>댓글 ({answer.comments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                placeholder="이 답변에 대한 댓글을 남겨보세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "등록 중..." : "댓글 등록"}
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {answer.comments.map((comment) => {
                const isLiked = likedComments.has(comment.id);
                return (
                  <div key={comment.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium">
                          {comment.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center space-x-1"
                      >
                        <Heart className={`h-3 w-3 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                        <span>{comment.likes}</span>
                      </Button>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}