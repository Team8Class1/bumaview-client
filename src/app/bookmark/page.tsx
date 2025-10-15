"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import {
  useBookmarks,
  useToggleBookmarkMutation,
} from "@/hooks/use-bookmark-queries-v2";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";

export default function BookmarkPage() {
  const { setBookmarkedIds } = useBookmark();
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // React Query hooks
  const {
    data: bookmarkData,
    isLoading,
    error,
  } = useBookmarks();
  const toggleBookmarkMutation = useToggleBookmarkMutation();

  const interviews = bookmarkData || [];

  // Update bookmarked IDs when data changes
  useEffect(() => {
    if (bookmarkData) {
      setBookmarkedIds(
        new Set(bookmarkData.map((item) => item.interviewId)),
      );
    }
  }, [bookmarkData, setBookmarkedIds]);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "로그인이 필요한 서비스입니다.",
        variant: "destructive",
      });
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router, toast]);

  const handleToggleBookmark = (e: React.MouseEvent, interviewId: number) => {
    e.preventDefault();
    e.stopPropagation();

    toggleBookmarkMutation.mutate(interviewId, {
      onSuccess: () => {
        toast({
          title: "북마크 해제",
          description: "북마크가 해제되었습니다.",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "북마크 해제 실패",
          description: "북마크 해제에 실패했습니다.",
        });
      },
    });
  };

  if (!_hasHydrated || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">즐겨찾기</h1>
          <p className="text-muted-foreground mt-2">
            즐겨찾기로 저장한 면접 질문들을 확인하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/interview">질문 검색</Link>
        </Button>
      </div>

      {interviews.length === 0 ? (
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
