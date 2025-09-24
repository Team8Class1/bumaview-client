"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { BookmarkX, Heart, Eye, MessageCircle, Building, Calendar, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Question } from "@/types/question";

interface BookmarkedQuestion extends Question {
  bookmarkedAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>('recent');

  // Mock bookmarked questions data
  useEffect(() => {
    const loadBookmarks = () => {
      setLoading(true);

      // Simulate API call with timeout
      setTimeout(() => {
        const mockBookmarks: BookmarkedQuestion[] = [
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
            replies: 12,
            bookmarkedAt: "2024-01-20T14:20:00Z"
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
            replies: 8,
            bookmarkedAt: "2024-01-18T16:45:00Z"
          },
          {
            id: "3",
            question: "머신러닝과 딥러닝의 차이점을 설명해주세요",
            category: "ai",
            company: "삼성전자",
            question_at: "2024",
            author: "익명",
            tags: ["AI", "Machine Learning", "Deep Learning"],
            createdAt: "2024-01-05T13:20:00Z",
            views: 456,
            likes: 78,
            replies: 15,
            bookmarkedAt: "2024-01-15T11:30:00Z"
          },
          {
            id: "4",
            question: "RESTful API 설계 원칙에 대해 설명해주세요",
            category: "back",
            company: "배달의민족",
            question_at: "2023",
            author: "익명",
            tags: ["API", "REST", "Backend"],
            createdAt: "2023-12-28T16:40:00Z",
            views: 312,
            likes: 56,
            replies: 11,
            bookmarkedAt: "2024-01-12T10:15:00Z"
          }
        ];

        setBookmarks(mockBookmarks);
        setLoading(false);
      }, 800);
    };

    loadBookmarks();
  }, []);

  const removeBookmark = (questionId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== questionId));
  };

  const filteredAndSortedBookmarks = bookmarks
    .filter(bookmark =>
      bookmark.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.bookmarkedAt).getTime() - new Date(b.bookmarkedAt).getTime();
        case 'alphabetical':
          return a.question.localeCompare(b.question);
        case 'recent':
        default:
          return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
      }
    });

  return (
    <>
      <Head>
        <title>북마크 | BumaView</title>
        <meta name="description" content="저장한 면접 질문들을 확인하고 관리하세요." />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                북마크
              </h1>
              <p className="text-muted-foreground mt-2">
                총 {filteredAndSortedBookmarks.length}개의 저장된 질문
              </p>
            </div>
            <Button asChild>
              <Link href="/questions">
                질문 둘러보기
              </Link>
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="북마크한 질문 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'alphabetical')}
                className="px-3 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">최근 저장순</option>
                <option value="oldest">오래전 저장순</option>
                <option value="alphabetical">가나다순</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-muted-foreground mt-4">북마크를 불러오는 중...</p>
            </div>
          ) : filteredAndSortedBookmarks.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">검색 결과가 없습니다</p>
                <p className="text-muted-foreground">다른 키워드로 검색해보세요</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">아직 북마크한 질문이 없습니다</p>
                <p className="text-muted-foreground mb-6">관심 있는 질문을 북마크해보세요</p>
                <Button asChild>
                  <Link href="/questions">
                    질문 둘러보기
                  </Link>
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-6">
              {filteredAndSortedBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <Link
                      href={`/questions/${bookmark.id}`}
                      className="flex-1"
                    >
                      <h3 className="text-lg font-semibold text-foreground hover:text-blue-500 transition-colors line-clamp-2">
                        {bookmark.question}
                      </h3>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmark(bookmark.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{bookmark.company}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{bookmark.question_at}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-blue-600">
                      <Heart className="h-4 w-4" />
                      <span>저장: {new Date(bookmark.bookmarkedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-md">
                      {bookmark.category}
                    </div>
                    {bookmark.tags && bookmark.tags.map((tag, index) => (
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
                        <span>{bookmark.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{bookmark.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{bookmark.replies}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">
                        by <span className="font-medium">{bookmark.author}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}