"use client";

import { Search, Users, UserCheck, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { RequireAdmin } from "@/components/auth/require-admin";
import { useUsers } from "@/hooks/use-user-queries";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: usersData, isLoading, error } = useUsers();

  // 검색 필터링
  const filteredUsers = usersData?.data?.filter((user) =>
    user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <RequireAdmin>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive">유저 목록을 불러오는데 실패했습니다.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              유저 관리
            </h1>
            <p className="text-muted-foreground mt-2">
              전체 유저 목록을 확인하고 관리할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 검색 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="유저 ID 또는 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 유저</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersData?.data?.length || 0}명
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">검색 결과</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredUsers.length}명
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">관리자</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersData?.data?.filter(user => user.role === 'ADMIN').length || 0}명
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 유저 목록 */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <Loading />
            </CardContent>
          </Card>
        ) : !usersData?.data || usersData.data.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">등록된 유저가 없습니다.</p>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                검색 조건에 맞는 유저가 없습니다.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")} 
                className="mt-4"
              >
                검색 초기화
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.userSequenceId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {user.role === 'ADMIN' ? (
                          <Shield className="h-6 w-6 text-primary" />
                        ) : (
                          <UserCheck className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.userId}</h3>
                        {user.email && (
                          <p className="text-muted-foreground">{user.email}</p>
                        )}
                        {user.role && (
                          <div className="mt-1">
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {user.createdAt && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">가입일</p>
                        <p className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RequireAdmin>
  );
}
