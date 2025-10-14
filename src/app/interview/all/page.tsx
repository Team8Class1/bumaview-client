"use client";

import { Bookmark, FolderPlus, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookmark } from "@/hooks/use-bookmark";
import { useAddInterviewsToGroup, useGroups } from "@/hooks/use-group-queries";
import { useInterviews } from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";
import type { InterviewItem } from "@/lib/api";

export default function InterviewAllPage() {
  const router = useRouter();
  const { bookmarkedIds, handleToggleBookmark } = useBookmark();
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [selectedInterviewForGroup, setSelectedInterviewForGroup] =
    useState<InterviewItem | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const { toast } = useToast();

  // React Query hooks
  const { data: interviewsData, isLoading: isLoadingInterviews } =
    useInterviews();
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups();
  const addInterviewsToGroupMutation = useAddInterviewsToGroup();

  const interviews = interviewsData?.data || [];
  const groups = groupsData?.data || [];
  const isLoading = isLoadingInterviews || isLoadingGroups;

  const openGroupDialog = (e: React.MouseEvent, interview: InterviewItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedInterviewForGroup(interview);
    setSelectedGroupId("");
    setShowGroupDialog(true);
  };

  const handleAddToGroup = () => {
    if (!selectedInterviewForGroup || !selectedGroupId) return;

    addInterviewsToGroupMutation.mutate(
      {
        groupId: selectedGroupId,
        data: { interviewIdList: [selectedInterviewForGroup.interviewId] },
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">전체 면접 질문</h1>
          <p className="text-muted-foreground mt-2">
            등록된 모든 면접 질문을 확인하세요.
          </p>
        </div>
        <Button asChild disabled={isLoading}>
          <Link href="/interview/create">질문 등록</Link>
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : interviews.length === 0 ? (
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

      <div className="mt-6 text-center text-sm text-muted-foreground">
        총 {interviews.length}개의 질문
      </div>

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
              disabled={addInterviewsToGroupMutation.isPending}
            >
              취소
            </Button>
            <Button
              onClick={handleAddToGroup}
              disabled={
                addInterviewsToGroupMutation.isPending ||
                !selectedGroupId ||
                groups.length === 0
              }
            >
              {addInterviewsToGroupMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
