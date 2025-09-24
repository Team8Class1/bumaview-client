"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, Lock, Globe, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Group {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  isPublic: boolean;
  createdAt: string;
  tags: string[];
}

export default function ProfileGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    const loadGroups = () => {
      setLoading(true);

      setTimeout(() => {
        const mockGroups: Group[] = [
          {
            id: "1",
            name: "프론트엔드 면접 질문",
            description: "React, Vue, JavaScript 관련 면접 질문들을 모은 그룹입니다.",
            questionCount: 15,
            isPublic: true,
            createdAt: "2024-01-20T10:00:00Z",
            tags: ["React", "JavaScript", "Frontend"]
          },
          {
            id: "2",
            name: "개인 학습용",
            description: "개인적으로 공부하는 질문들",
            questionCount: 8,
            isPublic: false,
            createdAt: "2024-01-15T14:30:00Z",
            tags: ["Study", "Personal"]
          },
          {
            id: "3",
            name: "데이터베이스 심화",
            description: "DB 설계와 최적화 관련 질문 모음",
            questionCount: 12,
            isPublic: true,
            createdAt: "2024-01-10T09:00:00Z",
            tags: ["Database", "SQL", "Backend"]
          }
        ];

        setGroups(mockGroups);
        setLoading(false);
      }, 800);
    };

    loadGroups();
  }, []);

  const filteredGroups = groups
    .filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'public' && group.isPublic) ||
                           (filterBy === 'private' && !group.isPublic);
      return matchesSearch && matchesFilter;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/profile" className="hover:text-foreground">프로필</Link>
          <span>/</span>
          <span className="text-foreground font-medium">내 그룹</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              내 그룹
            </h1>
            <p className="text-muted-foreground mt-2">
              총 {filteredGroups.length}개의 그룹
            </p>
          </div>
          <Button asChild>
            <Link href="/groups/create">
              <Plus className="h-4 w-4 mr-2" />
              새 그룹 만들기
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="그룹 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'public' | 'private')}
              className="px-3 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="public">공개 그룹</option>
              <option value="private">비공개 그룹</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">그룹을 불러오는 중...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          searchQuery || filterBy !== 'all' ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">검색 결과가 없습니다</p>
              <p className="text-muted-foreground">다른 조건으로 검색해보세요</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">아직 생성한 그룹이 없습니다</p>
              <p className="text-muted-foreground mb-6">관심 있는 질문들을 모아 그룹을 만들어보세요</p>
              <Button asChild>
                <Link href="/groups/create">
                  <Plus className="h-4 w-4 mr-2" />
                  첫 그룹 만들기
                </Link>
              </Button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {group.isPublic ? (
                      <Globe className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-500" />
                    )}
                    <Badge variant={group.isPublic ? "default" : "secondary"} className="text-xs">
                      {group.isPublic ? "공개" : "비공개"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {group.questionCount}개 질문
                  </span>
                </div>

                <Link href={`/groups/${group.id}`}>
                  <h3 className="text-lg font-semibold text-foreground hover:text-blue-500 transition-colors mb-2 line-clamp-1">
                    {group.name}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {group.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(group.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/groups/${group.id}`}>보기</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/groups/${group.id}/edit`}>수정</Link>
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