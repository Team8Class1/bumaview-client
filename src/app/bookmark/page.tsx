"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookmarkButton } from "@/components/bookmark/bookmark-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useBookmarks } from "@/hooks/use-bookmark-queries";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";
import type { AllInterviewDto } from "@/types/api";

export default function BookmarkPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // React Query hooks
  const { data: bookmarks, isLoading, isError, error } = useBookmarks();

  // 인증 체크
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

  // 로딩 상태
  if (!_hasHydrated || isLoading) {
    return <Loading />;
  }

  // 오류 상태
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">북마크 로딩 실패</h1>
          <p className="text-muted-foreground mb-4">
            {error?.message || "북마크 목록을 불러오지 못했습니다."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const interviews: AllInterviewDto[] = bookmarks || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">북마크</h1>
        <p className="text-muted-foreground">
          총 {interviews.length}개의 북마크
        </p>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">북마크한 면접 질문이 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/interview">면접 질문 둘러보기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card
              key={interview.interviewId}
              className="hover:shadow-md transition-shadow relative"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <CardTitle className="text-lg leading-relaxed">
                      <Link
                        href={`/interview/${interview.interviewId}`}
                        className="hover:text-primary transition-colors"
                      >
                        {interview.question}
                      </Link>
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

                  <BookmarkButton
                    interviewId={interview.interviewId}
                    className="shrink-0"
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{interview.companyName}</span>
                  <span>{new Date(interview.questionAt).getFullYear()}년</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
