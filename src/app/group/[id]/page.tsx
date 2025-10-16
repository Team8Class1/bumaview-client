"use client";

import { MessageSquare, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { BookmarkButton } from "@/components/bookmark/bookmark-button";
import { AddUserDialog } from "@/components/group/add-user-dialog";
import {
  useAddInterviewsToGroupMutation,
  useGroup,
  useGroupUsers,
  useGroups,
} from "@/hooks/use-group-queries";
import { useInterviews } from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";
import type { InterviewItem } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [availableInterviews, setAvailableInterviews] = useState<
    InterviewItem[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterviewIds, setSelectedInterviewIds] = useState<number[]>(
    [],
  );
  // 북마크 기능은 BookmarkButton 컴포넌트에서 처리
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // React Query hooks
  const { data: groupInterviews, isLoading } = useGroup(params.id as string);
  const { data: groupUsers } = useGroupUsers(Number(params.id));
  const { data: groupsData } = useGroups();
  const { data: allInterviewsData } = useInterviews();
  const addInterviewsToGroupMutation = useAddInterviewsToGroupMutation();

  // Find current group info from groups list
  const group = groupsData?.data?.find((g) => g.groupId === Number(params.id));

  const openAddDialog = () => {
    if (!allInterviewsData || !groupInterviews) return;

    // 이미 그룹에 있는 질문 제외
    const groupInterviewIds = groupInterviews.data.map((i) => i.interviewId);
    const available = allInterviewsData.data.filter(
      (interview) => !groupInterviewIds.includes(interview.interviewId),
    );
    setAvailableInterviews(available);
    setShowAddDialog(true);
  };

  const handleAddInterviews = () => {
    if (!group || selectedInterviewIds.length === 0) return;

    addInterviewsToGroupMutation.mutate(
      {
        groupId: Number(params.id),
        data: { interviewIdList: selectedInterviewIds },
      },
      {
        onSuccess: () => {
          toast({
            title: "질문 추가",
            description: `${selectedInterviewIds.length}개의 질문이 그룹에 추가되었습니다.`,
          });
          setShowAddDialog(false);
          setSelectedInterviewIds([]);
          setSearchQuery("");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "추가 실패",
            description: "질문 추가에 실패했습니다.",
          });
        },
      },
    );
  };

  const toggleInterviewSelection = (interviewId: number) => {
    setSelectedInterviewIds((prev) =>
      prev.includes(interviewId)
        ? prev.filter((id) => id !== interviewId)
        : [...prev, interviewId],
    );
  };

  const filteredInterviews = availableInterviews.filter((interview) =>
    interview.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  if (!_hasHydrated || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button variant="outline" onClick={() => router.back()}>
            ← 돌아가기
          </Button>
          <h1 className="text-3xl font-bold mt-4">{group?.name}</h1>
          <p className="text-muted-foreground mt-2">
            {`${groupInterviews?.data?.length || 0}개의 질문`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openAddDialog} disabled={!group || !allInterviewsData}>
            <Plus className="h-4 w-4 mr-2" />
            질문 추가
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAddUserDialog(true)} 
            disabled={!group}
          >
            <Users className="h-4 w-4 mr-2" />
            유저 추가
          </Button>
        </div>
      </div>

      {!group ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">그룹을 찾을 수 없습니다.</p>
            <Button
              onClick={() => router.push("/group")}
              className="mt-4"
              variant="outline"
            >
              목록으로
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 그룹 유저 목록 - 항상 표시 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                그룹 멤버 ({groupUsers?.data?.length || 0}명)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!groupUsers?.data || groupUsers.data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>그룹에 추가된 멤버가 없습니다.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddUserDialog(true)} 
                    className="mt-4"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    첫 번째 멤버 추가하기
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupUsers.data.map((user) => (
                    <div
                      key={user.userSequenceId}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.userId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 질문 목록 */}
          {!groupInterviews?.data || groupInterviews.data.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  그룹에 추가된 질문이 없습니다.
                </p>
                <Button onClick={openAddDialog} className="mt-4">
                  질문 추가하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {groupInterviews?.data?.map((interview) => (
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
                    <BookmarkButton 
                      interviewId={interview.interviewId}
                      className="shrink-0"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {interview.companyName && (
                      <span className="font-medium text-foreground">
                        {interview.companyName}
                      </span>
                    )}
                    <span>
                      {new Date(interview.questionAt).getFullYear()}년
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 질문 추가 다이얼로그 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>질문 추가</DialogTitle>
            <DialogDescription>
              그룹에 추가할 질문을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="질문 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 질문 목록 */}
            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              {filteredInterviews.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  {availableInterviews.length === 0
                    ? "추가할 수 있는 질문이 없습니다."
                    : "검색 결과가 없습니다."}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredInterviews.map((interview) => (
                    <button
                      type="button"
                      key={interview.interviewId}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left w-full ${
                        selectedInterviewIds.includes(interview.interviewId)
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() =>
                        toggleInterviewSelection(interview.interviewId)
                      }
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedInterviewIds.includes(
                            interview.interviewId,
                          )}
                          onChange={() =>
                            toggleInterviewSelection(interview.interviewId)
                          }
                          className="mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{interview.question}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            {interview.companyName && (
                              <span className="font-medium text-foreground">
                                {interview.companyName}
                              </span>
                            )}
                            <span>
                              {new Date(interview.questionAt).getFullYear()}년
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {interview.categoryList.map((cat) => (
                              <span
                                key={cat.categoryId}
                                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                              >
                                {cat.categoryName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setSelectedInterviewIds([]);
                setSearchQuery("");
              }}
              disabled={addInterviewsToGroupMutation.isPending}
            >
              취소
            </Button>
            <Button
              onClick={handleAddInterviews}
              disabled={
                addInterviewsToGroupMutation.isPending ||
                selectedInterviewIds.length === 0
              }
            >
              {addInterviewsToGroupMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 유저 추가 다이얼로그 */}
      {group && (
        <AddUserDialog
          open={showAddUserDialog}
          onOpenChange={setShowAddUserDialog}
          groupId={group.groupId}
          groupName={group.name}
        />
      )}
    </>
  );
}
