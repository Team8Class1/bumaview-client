"use client";

import { Bookmark, MessageSquare } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import {
  getAllInterviews,
  getBookmarks,
  toggleBookmark,
  type InterviewItem,
} from "@/lib/api";

export default function InterviewAllPage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewResponse, bookmarkResponse] = await Promise.all([
          getAllInterviews(),
          getBookmarks(),
        ]);
        setInterviews(interviewResponse.data);
        setBookmarkedIds(
          new Set(bookmarkResponse.data.map((item) => item.interviewId)),
        );
      } catch (_error) {
        toast({
          variant: "destructive",
          title: "데이터 로드 실패",
          description: "면접 질문 목록을 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">데이터를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">전체 면접 질문</h1>
          <p className="text-muted-foreground mt-2">
            등록된 모든 면접 질문을 확인하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/interview/create">질문 등록</Link>
        </Button>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              등록된 면접 질문이 없습니다.
            </p>
            <Button asChild className="mt-4">
              <Link href="/interview/create">첫 질문 등록하기</Link>
            </Button>
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

      <div className="mt-6 text-center text-sm text-muted-foreground">
        총 {interviews.length}개의 질문
      </div>
    </div>
  );
}
