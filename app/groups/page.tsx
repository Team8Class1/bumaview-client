"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Group } from "@/types/group";
import { Users, BookOpen, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

const mockGroups: Group[] = [
  {
    id: "1",
    name: "프론트엔드 기초 면접 질문",
    description: "React, Vue, Angular 등 프론트엔드 개발 기초 면접 질문 모음",
    userId: "user1",
    questionIds: ["1", "2", "3", "4", "5"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "2", 
    name: "네이버 면접 기출 문제",
    description: "네이버 공채 및 경력직 면접에서 나온 실제 질문들",
    userId: "user2",
    questionIds: ["6", "7", "8"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "3",
    name: "백엔드 시스템 설계",
    description: "대용량 시스템 설계, 아키텍처 관련 면접 질문 모음",
    userId: "user3", 
    questionIds: ["9", "10", "11", "12", "13", "14", "15"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22")
  },
  {
    id: "4",
    name: "신입 개발자 공통 질문",
    description: "신입 개발자라면 꼭 알아야 할 기본적인 CS 질문들",
    userId: "user4",
    questionIds: ["16", "17", "18", "19"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-25")
  },
  {
    id: "5",
    name: "AI/ML 엔지니어 면접",
    description: "머신러닝, 딥러닝, 데이터 사이언스 관련 면접 질문",
    userId: "user5",
    questionIds: ["20", "21"],
    createdAt: new Date("2023-12-28"),
    updatedAt: new Date("2024-01-23")
  }
];

export default function GroupsPage() {
  const [groups] = useState<Group[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "questions":
        return b.questionIds.length - a.questionIds.length;
      case "name":
        return a.name.localeCompare(b.name);
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
              질문 그룹
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              주제별로 정리된 면접 질문 모음집을 탐색하세요
            </p>
          </div>
          <Button asChild>
            <Link href="/groups/create" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>새 그룹 만들기</span>
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="그룹 이름이나 설명으로 검색..."
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
                  <SelectItem value="recent">최근 업데이트</SelectItem>
                  <SelectItem value="oldest">오래된 순</SelectItem>
                  <SelectItem value="questions">질문 많은 순</SelectItem>
                  <SelectItem value="name">이름 순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border mb-4">
              <h3 className="font-medium mb-2">카테고리별 필터</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">프론트엔드</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">백엔드</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">AI/ML</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">신입</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">경력</Badge>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      <Link href={`/groups/${group.id}`} className="hover:text-blue-600">
                        {group.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{group.questionIds.length}개 질문</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>12명 참여</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {group.updatedAt.toLocaleDateString('ko-KR')} 업데이트
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/groups/${group.id}`}>보기</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/groups/${group.id}/study`}>학습하기</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              다른 키워드로 검색해보거나 새 그룹을 만들어보세요
            </p>
            <Button asChild variant="outline">
              <Link href="/groups/create">새 그룹 만들기</Link>
            </Button>
          </div>
        )}

        {/* 추천 그룹 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            추천 그룹
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">신입 개발자</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">기초 CS 지식</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">대기업 면접</h3>
                <p className="text-sm text-green-700 dark:text-green-300">삼성, LG, 현대</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">스타트업</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">빠른 성장 기업</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6 text-center">
                <div className="bg-orange-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">알고리즘</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">코딩 테스트</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}