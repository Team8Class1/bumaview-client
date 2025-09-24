"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Question } from "@/types/question";

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const [formData, setFormData] = useState({
    question: "",
    category: "",
    company: "",
    year: "2024"
  });
  const [originalData, setOriginalData] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load question data
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);

        // TODO: Replace with real API call
        // Simulate loading question data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockQuestion: Question = {
          id: questionId,
          question: "React의 useEffect 훅에 대해 설명해주세요",
          category: "front",
          company: "카카오",
          question_at: "2024",
          author: "익명",
          tags: ["React", "Hooks", "Frontend"],
          createdAt: "2024-01-15T10:30:00Z",
          views: 234,
          likes: 45,
          replies: 12
        };

        setOriginalData(mockQuestion);
        setFormData({
          question: mockQuestion.question,
          category: mockQuestion.category,
          company: mockQuestion.company,
          year: mockQuestion.question_at
        });
      } catch (error) {
        console.error('Failed to load question:', error);
        alert('질문을 불러오는데 실패했습니다.');
        router.push('/questions');
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      loadQuestion();
    }
  }, [questionId, router]);

  const hasChanges = originalData && (
    formData.question !== originalData.question ||
    formData.category !== originalData.category ||
    formData.company !== originalData.company ||
    formData.year !== originalData.question_at
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.category || !formData.company) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!hasChanges) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("질문이 수정되었습니다!");
      router.push(`/questions/${questionId}`);
    } catch (error) {
      alert("질문 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000); // Auto-hide after 5 seconds
      return;
    }

    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("질문이 삭제되었습니다.");
      router.push('/questions');
    } catch (error) {
      alert("질문 삭제에 실패했습니다.");
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

  if (!originalData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">질문을 찾을 수 없습니다.</p>
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
            <Link href={`/questions/${questionId}`} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>질문으로 돌아가기</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>질문 수정</CardTitle>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    저장되지 않은 변경사항
                  </span>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className={showDeleteConfirm ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {showDeleteConfirm ? '삭제 확인' : '질문 삭제'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-foreground mb-2">
                  질문 내용 *
                </label>
                <Textarea
                  id="question"
                  placeholder="면접에서 받은 질문을 정확히 입력해주세요..."
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    카테고리 *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">프론트엔드</SelectItem>
                      <SelectItem value="back">백엔드</SelectItem>
                      <SelectItem value="ai">AI/ML</SelectItem>
                      <SelectItem value="mobile">모바일</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="data">데이터</SelectItem>
                      <SelectItem value="bank">금융</SelectItem>
                      <SelectItem value="game">게임</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    회사명 *
                  </label>
                  <Input
                    id="company"
                    placeholder="회사명 입력"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-foreground mb-2">
                    면접 연도 *
                  </label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Original vs Current Comparison */}
              {hasChanges && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-3">
                    변경사항 미리보기
                  </h3>
                  <div className="space-y-2 text-sm">
                    {formData.question !== originalData.question && (
                      <div>
                        <p className="text-red-600 dark:text-red-400">- {originalData.question}</p>
                        <p className="text-green-600 dark:text-green-400">+ {formData.question}</p>
                      </div>
                    )}
                    {formData.category !== originalData.category && (
                      <div>
                        <p className="text-red-600 dark:text-red-400">- 카테고리: {originalData.category}</p>
                        <p className="text-green-600 dark:text-green-400">+ 카테고리: {formData.category}</p>
                      </div>
                    )}
                    {formData.company !== originalData.company && (
                      <div>
                        <p className="text-red-600 dark:text-red-400">- 회사: {originalData.company}</p>
                        <p className="text-green-600 dark:text-green-400">+ 회사: {formData.company}</p>
                      </div>
                    )}
                    {formData.year !== originalData.question_at && (
                      <div>
                        <p className="text-red-600 dark:text-red-400">- 연도: {originalData.question_at}</p>
                        <p className="text-green-600 dark:text-green-400">+ 연도: {formData.year}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  수정 가이드라인
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 질문의 원래 의도를 훼손하지 않도록 수정해주세요</li>
                  <li>• 오타나 표현을 명확하게 하는 수정은 권장됩니다</li>
                  <li>• 질문의 본질적인 내용을 바꾸는 것은 신중히 고려해주세요</li>
                  <li>• 개인정보나 민감한 정보는 제거해주세요</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/questions/${questionId}`}>취소</Link>
                </Button>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !hasChanges}
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSubmitting ? "저장 중..." : "변경사항 저장"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}