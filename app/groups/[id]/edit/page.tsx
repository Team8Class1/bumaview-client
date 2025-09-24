"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Plus, X, Building, Calendar, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Question } from "@/types/question";

interface Group {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  questions: Question[];
  createdAt: string;
  author: string;
}

export default function EditGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [originalGroup, setOriginalGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    isPublic: true
  });
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock questions for search
  const mockQuestions: Question[] = [
    {
      id: "1",
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
    },
    {
      id: "2",
      question: "데이터베이스 정규화에 대해 설명해주세요",
      category: "back",
      company: "네이버",
      question_at: "2024",
      author: "익명",
      tags: ["Database", "SQL", "Backend"],
      createdAt: "2024-01-10T09:15:00Z",
      views: 189,
      likes: 32,
      replies: 8
    }
  ];

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);

        // TODO: Replace with real API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockGroup: Group = {
          id: groupId,
          name: "프론트엔드 면접 질문",
          description: "프론트엔드 개발자 면접에서 자주 나오는 질문들을 모은 그룹입니다.",
          tags: ["React", "JavaScript", "Frontend"],
          isPublic: true,
          questions: [mockQuestions[0]],
          createdAt: "2024-01-20T10:00:00Z",
          author: "현재사용자"
        };

        setOriginalGroup(mockGroup);
        setFormData({
          name: mockGroup.name,
          description: mockGroup.description,
          tags: mockGroup.tags,
          isPublic: mockGroup.isPublic
        });
        setSelectedQuestions(mockGroup.questions);
      } catch (error) {
        console.error('Failed to load group:', error);
        alert('그룹을 불러오는데 실패했습니다.');
        router.push('/groups');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      loadGroup();
    }
  }, [groupId, router]);

  const hasChanges = originalGroup && (
    formData.name !== originalGroup.name ||
    formData.description !== originalGroup.description ||
    JSON.stringify(formData.tags) !== JSON.stringify(originalGroup.tags) ||
    formData.isPublic !== originalGroup.isPublic ||
    selectedQuestions.length !== originalGroup.questions.length ||
    !selectedQuestions.every(q => originalGroup.questions.some(oq => oq.id === q.id))
  );

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    setTimeout(() => {
      const results = mockQuestions.filter(q =>
        !selectedQuestions.some(sq => sq.id === q.id) &&
        (q.question.toLowerCase().includes(query.toLowerCase()) ||
         q.company.toLowerCase().includes(query.toLowerCase()) ||
         q.category.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const addQuestion = (question: Question) => {
    setSelectedQuestions(prev => [...prev, question]);
    setSearchResults(prev => prev.filter(q => q.id !== question.id));
  };

  const removeQuestion = (questionId: string) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("그룹 이름을 입력해주세요.");
      return;
    }

    if (!hasChanges) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`'${formData.name}' 그룹이 수정되었습니다!`);
      router.push(`/groups/${groupId}`);
    } catch (error) {
      alert("그룹 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("그룹이 삭제되었습니다.");
      router.push('/groups');
    } catch (error) {
      alert("그룹 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">그룹을 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!originalGroup) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">그룹을 찾을 수 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/groups">그룹 목록으로</Link>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/groups/${groupId}`} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>그룹으로 돌아가기</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">그룹 수정</h1>
          <div className="flex items-center space-x-4">
            {hasChanges && (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                저장되지 않은 변경사항
              </span>
            )}
            <Button
              variant="destructive"
              onClick={handleDelete}
              className={showDeleteConfirm ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {showDeleteConfirm ? '삭제 확인' : '그룹 삭제'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Group Info */}
            <Card>
              <CardHeader>
                <CardTitle>그룹 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    그룹 이름 *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    그룹 설명
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    태그
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      placeholder="태그 입력 후 Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    공개 설정
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        checked={formData.isPublic}
                        onChange={() => setFormData({...formData, isPublic: true})}
                        className="mr-2"
                      />
                      공개 - 모든 사용자가 볼 수 있습니다
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!formData.isPublic}
                        onChange={() => setFormData({...formData, isPublic: false})}
                        className="mr-2"
                      />
                      비공개 - 본인만 볼 수 있습니다
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Questions */}
            <Card>
              <CardHeader>
                <CardTitle>질문 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="질문 검색..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-muted-foreground mt-2">검색 중...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((question) => (
                      <div key={question.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium line-clamp-2 flex-1">
                            {question.question}
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addQuestion(question)}
                            className="ml-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{question.company}</span>
                          <span>•</span>
                          <span>{question.category}</span>
                        </div>
                      </div>
                    ))
                  ) : searchQuery ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">검색 결과가 없습니다</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">질문을 검색해서 그룹에 추가하세요</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Questions */}
          <Card>
            <CardHeader>
              <CardTitle>현재 질문 ({selectedQuestions.length}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedQuestions.map((question) => (
                  <div key={question.id} className="p-3 border border-border rounded-lg flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 mb-1">
                        {question.question}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{question.company}</span>
                        <span>•</span>
                        <span>{question.category}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href={`/groups/${groupId}`}>취소</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "저장 중..." : "변경사항 저장"}</span>
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}