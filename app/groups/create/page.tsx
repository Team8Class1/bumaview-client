"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Plus, X, Building, Calendar, Eye, ThumbsUp, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Question } from "@/types/question";

interface SelectedQuestion extends Question {
  selected?: boolean;
}

export default function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    isPublic: true
  });
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([]);
  const [searchResults, setSearchResults] = useState<SelectedQuestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
    {
      id: "3",
      question: "JavaScript의 클로저에 대해 설명해주세요",
      category: "front",
      company: "토스",
      question_at: "2024",
      author: "익명",
      tags: ["JavaScript", "Closure"],
      createdAt: "2024-01-05T13:20:00Z",
      views: 456,
      likes: 78,
      replies: 15
    }
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    // Simulate API search
    setTimeout(() => {
      const results = mockQuestions.filter(q =>
        q.question.toLowerCase().includes(query.toLowerCase()) ||
        q.company.toLowerCase().includes(query.toLowerCase()) ||
        q.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const toggleQuestionSelection = (question: Question) => {
    const isSelected = selectedQuestions.some(q => q.id === question.id);

    if (isSelected) {
      setSelectedQuestions(prev => prev.filter(q => q.id !== question.id));
    } else {
      setSelectedQuestions(prev => [...prev, question]);
    }
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

    if (selectedQuestions.length === 0) {
      alert("최소 1개 이상의 질문을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`'${formData.name}' 그룹이 생성되었습니다! (${selectedQuestions.length}개 질문)`);

      // Reset form
      setFormData({
        name: "",
        description: "",
        tags: [],
        isPublic: true
      });
      setSelectedQuestions([]);
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      alert("그룹 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/groups" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>그룹 목록으로</span>
            </Link>
          </Button>
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
                    placeholder="프론트엔드 면접 질문, React 심화 질문..."
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
                    placeholder="이 그룹에 대한 설명을 입력하세요..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
                    태그
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      id="tags"
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

                {/* Selected Questions Count */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    선택된 질문: {selectedQuestions.length}개
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    오른쪽에서 질문을 검색하고 선택하세요
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Question Search & Selection */}
            <Card>
              <CardHeader>
                <CardTitle>질문 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="질문 검색..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-muted-foreground mt-2">검색 중...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((question) => {
                      const isSelected = selectedQuestions.some(q => q.id === question.id);
                      return (
                        <div
                          key={question.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-border hover:border-blue-300'
                          }`}
                          onClick={() => toggleQuestionSelection(question)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium line-clamp-2">
                              {question.question}
                            </p>
                            <div className="ml-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleQuestionSelection(question)}
                                className="h-4 w-4 text-blue-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{question.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{question.question_at}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{question.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{question.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{question.replies}</span>
                              </div>
                            </div>

                            <Badge variant="outline" className="px-2 py-0 text-xs">
                              {question.category}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
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

          {/* Selected Questions List */}
          {selectedQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>선택된 질문 ({selectedQuestions.length}개)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
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
                        onClick={() => toggleQuestionSelection(question)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/groups">취소</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || selectedQuestions.length === 0}
            >
              {isSubmitting ? "생성 중..." : "그룹 생성"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}