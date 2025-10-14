"use client";

import { Bookmark, Filter, FolderPlus, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookmark } from "@/hooks/use-bookmark";
import { useBookmarks } from "@/hooks/use-bookmark-queries";
import { useAddInterviewsToGroup, useGroups } from "@/hooks/use-group-queries";
import {
  useInterviewCreateData,
  useInterviewSearch,
} from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";
import type { InterviewFilterParams, InterviewItem } from "@/lib/api";

export default function InterviewPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<InterviewFilterParams>({});
  const { bookmarkedIds, setBookmarkedIds, handleToggleBookmark } =
    useBookmark();
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [selectedInterviewForGroup, setSelectedInterviewForGroup] =
    useState<InterviewItem | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const { toast } = useToast();

  // React Query hooks
  const { data: createData } = useInterviewCreateData();
  const { data: interviewData, isLoading } = useInterviewSearch(filters);
  const { data: bookmarkData } = useBookmarks();
  const { data: groupData } = useGroups();
  const addToGroupMutation = useAddInterviewsToGroup();

  const interviews = interviewData?.data || [];
  const companies = createData?.companyList || [];
  const categories = createData?.categoryList || [];
  const groups = groupData?.data || [];

  // Update bookmarked IDs when bookmark data changes
  useEffect(() => {
    if (bookmarkData?.data) {
      setBookmarkedIds(
        new Set(bookmarkData.data.map((item) => item.interviewId)),
      );
    }
  }, [bookmarkData?.data, setBookmarkedIds]);

  const openGroupDialog = (e: React.MouseEvent, interview: InterviewItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedInterviewForGroup(interview);
    setSelectedGroupId("");
    setShowGroupDialog(true);
  };

  const handleAddToGroup = () => {
    if (!selectedInterviewForGroup || !selectedGroupId) return;

    addToGroupMutation.mutate(
      {
        groupId: selectedGroupId,
        data: {
          interviewIdList: [selectedInterviewForGroup.interviewId],
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "그룹에 추가",
            description: "질문이 그룹에 추가되었습니다.",
          });
          setShowGroupDialog(false);
          setSelectedInterviewForGroup(null);
          setSelectedGroupId("");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "추가 실패",
            description: "그룹에 질문을 추가하는데 실패했습니다.",
          });
        },
      },
    );
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
    <>
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
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) =>
                          handleToggleBookmark(e, interview.interviewId)
                        }
                        className="shrink-0"
                        aria-label={
                          bookmarkedIds.has(interview.interviewId)
                            ? "북마크 해제"
                            : "북마크 추가"
                        }
                      >
                        <Bookmark
                          className={`h-5 w-5 ${
                            bookmarkedIds.has(interview.interviewId)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => openGroupDialog(e, interview)}
                        className="shrink-0"
                        aria-label="그룹에 추가"
                      >
                        <FolderPlus className="h-5 w-5" />
                      </Button>
                    </div>
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

      {/* 그룹에 추가 다이얼로그 */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>그룹에 추가</DialogTitle>
            <DialogDescription>
              이 질문을 추가할 그룹을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>생성된 그룹이 없습니다.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGroupDialog(false);
                    router.push("/group");
                  }}
                  className="mt-4"
                >
                  그룹 만들기
                </Button>
              </div>
            ) : (
              <Select
                value={selectedGroupId}
                onValueChange={setSelectedGroupId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="그룹 선택" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem
                      key={group.groupId}
                      value={group.groupId.toString()}
                    >
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowGroupDialog(false);
                setSelectedInterviewForGroup(null);
                setSelectedGroupId("");
              }}
              disabled={addToGroupMutation.isPending}
            >
              취소
            </Button>
            <Button
              onClick={handleAddToGroup}
              disabled={
                addToGroupMutation.isPending ||
                !selectedGroupId ||
                groups.length === 0
              }
            >
              {addToGroupMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
