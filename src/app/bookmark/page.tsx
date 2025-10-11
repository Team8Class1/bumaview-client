"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useBookmark } from "@/hooks/use-bookmark";
import { useToast } from "@/hooks/use-toast";
import { getBookmarks, type InterviewItem, toggleBookmark } from "@/lib/api";

export default function BookmarkPage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { bookmarkedIds, setBookmarkedIds } = useBookmark();
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await getBookmarks();
      setInterviews(response.data);
      setBookmarkedIds(new Set(response.data.map((item) => item.interviewId)));
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "데이터 로드 실패",
        description: "북마크 목록을 불러오는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, setBookmarkedIds]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

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

    // 즉시 목록에서 제거
    setInterviews((prev) =>
      prev.filter((item) => item.interviewId !== interviewId),
    );

    try {
      await toggleBookmark(interviewId);
      toast({
        title: "북마크 해제",
        description: "북마크가 해제되었습니다.",
      });
    } catch (_error) {
      // 에러 시 롤백
      setBookmarkedIds(bookmarkedIds);
      await fetchBookmarks();
      toast({
        variant: "destructive",
        title: "북마크 해제 실패",
        description: "북마크 해제에 실패했습니다.",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">즐겨찾기</h1>
          <p className="text-muted-foreground mt-2">
            즐겨찾기로 저장한 면접 질문들을 확인하세요.
          </p>
        </div>
        <Button asChild disabled={isLoading}>
          <Link href="/interview">질문 검색</Link>
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : interviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">북마크한 질문이 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/interview">질문 검색하기</Link>
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
                      aria-label="북마크 해제"
                    >
                      <Bookmark className="h-5 w-5 fill-current" />
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

      {interviews.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          총 {interviews.length}개의 북마크
        </div>
      )}
    </>
  );
}
