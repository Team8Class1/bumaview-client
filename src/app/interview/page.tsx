"use client";

import { Bookmark, Filter, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getBookmarks,
  getInterviewCreateData,
  getInterviews,
  toggleBookmark,
  type InterviewFilterParams,
  type InterviewItem,
} from "@/lib/api";

export default function InterviewPage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<
    Array<{ companyId: number; companyName: string }>
  >([]);
  const [categories, setCategories] = useState<
    Array<{ categoryId: number; categoryName: string }>
  >([]);
  const [filters, setFilters] = useState<InterviewFilterParams>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [createData, bookmarkResponse] = await Promise.all([
          getInterviewCreateData(),
          getBookmarks(),
        ]);
        setCompanies(createData.companyList);
        setCategories(createData.categoryList);
        setBookmarkedIds(
          new Set(bookmarkResponse.data.map((item) => item.interviewId)),
        );
      } catch (_error) {
        toast({
          variant: "destructive",
          title: "데이터 로드 실패",
          description: "필터 데이터를 불러오는데 실패했습니다.",
        });
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const response = await getInterviews(filters);
        setInterviews(response.data);
      } catch (_error) {
        toast({
          variant: "destructive",
          title: "검색 실패",
          description: "면접 질문을 검색하는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [filters, toast]);

  const handleToggleBookmark = async (
    e: React.MouseEvent,
    interviewId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newBookmarkedIds = new Set(bookmarkedIds);
    if (newBookmarkedIds.has(interviewId)) {
      newBookmarkedIds.delete(interviewId);
    } else {
      newBookmarkedIds.add(interviewId);
    }
    setBookmarkedIds(newBookmarkedIds);

    try {
      await toggleBookmark(interviewId);
      toast({
        title: newBookmarkedIds.has(interviewId)
          ? "북마크 추가"
          : "북마크 해제",
        description: newBookmarkedIds.has(interviewId)
          ? "북마크에 추가되었습니다."
          : "북마크가 해제되었습니다.",
      });
    } catch (_error) {
      // 에러 시 롤백
      setBookmarkedIds(bookmarkedIds);
      toast({
        variant: "destructive",
        title: "북마크 변경 실패",
        description: "북마크 변경에 실패했습니다.",
      });
    }
  };

  const handleFilterChange = (
    key: keyof InterviewFilterParams,
    value: string,
  ) => {
    if (value === "all") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [key]:
          key === "year"
            ? value
            : key === "myQuestions"
              ? value === "true"
              : Number(value),
      });
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">면접 질문 검색</h1>
          <p className="text-muted-foreground mt-2">
            원하는 조건으로 면접 질문을 검색하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/interview/create">질문 등록</Link>
        </Button>
      </div>

      {/* 필터 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle className="text-lg">필터</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                초기화
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">학년도</div>
              <Select
                value={filters.year || "all"}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="2024">2024년</SelectItem>
                  <SelectItem value="2023">2023년</SelectItem>
                  <SelectItem value="2022">2022년</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">회사</div>
              <Select
                value={filters.companyId?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange("companyId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {companies.map((company) => (
                    <SelectItem
                      key={company.companyId}
                      value={company.companyId.toString()}
                    >
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">직군</div>
              <Select
                value={filters.categoryId?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="myQuestions"
                checked={filters.myQuestions || false}
                onChange={(e) =>
                  handleFilterChange("myQuestions", e.target.checked.toString())
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="myQuestions" className="text-sm font-medium">
                내가 등록한 질문만 보기
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">검색 중...</p>
          </CardContent>
        </Card>
      ) : interviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="mt-4" variant="outline">
                필터 초기화
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card
              key={interview.interviewId}
              className="hover:shadow-md transition-shadow"
            >
              <Link href={`/interview/${interview.interviewId}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {interview.question}
                      </CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap gap-2">
                        {interview.categoryList.map((cat) => (
                          <span
                            key={cat.categoryId}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                          >
                            {cat.categoryName}
                          </span>
                        ))}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) =>
                        handleToggleBookmark(e, interview.interviewId)
                      }
                      className="shrink-0"
                    >
                      <Bookmark
                        className={`h-5 w-5 ${
                          bookmarkedIds.has(interview.interviewId)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {interview.companyName && (
                      <span className="font-medium text-foreground">
                        {interview.companyName}
                      </span>
                    )}
                    <span>{interview.questionAt}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && interviews.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {interviews.length}개의 질문
        </div>
      )}
    </div>
  );
}
