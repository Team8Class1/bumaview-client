"use client";

import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Reply,
  Trash2,
  X,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createAnswer,
  createAnswerReply,
  deleteAnswer,
  deleteInterview,
  getInterviewDetail,
  type InterviewAnswer,
  type InterviewDetail,
  likeAnswer,
  updateAnswer,
} from "@/lib/api";

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Answer related states
  const [newAnswer, setNewAnswer] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingAnswer, setEditingAnswer] = useState<number | null>(null);
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editAnswerPrivate, setEditAnswerPrivate] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const id = Number(params.id);
        const data = await getInterviewDetail(id);
        setInterview(data);
      } catch (_error) {
        toast({
          variant: "destructive",
          title: "로드 실패",
          description: "면접 질문을 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [params.id, toast]);

  const handleDelete = async () => {
    if (!interview) return;

    setIsDeleting(true);
    try {
      await deleteInterview(interview.interviewId);
      toast({
        title: "삭제 완료",
        description: "면접 질문이 삭제되었습니다.",
      });
      router.push("/interview");
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "면접 질문 삭제에 실패했습니다.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!interview || !newAnswer.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      if (replyTo) {
        await createAnswerReply({
          interviewId: interview.interviewId,
          answer: newAnswer,
          isPrivate,
          parentAnswerId: replyTo,
        });
        toast({
          title: "대댓글 등록",
          description: "대댓글이 성공적으로 등록되었습니다.",
        });
      } else {
        await createAnswer({
          interviewId: interview.interviewId,
          answer: newAnswer,
          isPrivate,
        });
        toast({
          title: "답변 등록",
          description: "답변이 성공적으로 등록되었습니다.",
        });
      }

      // 답변 등록 후 인터뷰 데이터 새로고침
      const data = await getInterviewDetail(interview.interviewId);
      setInterview(data);
      setNewAnswer("");
      setIsPrivate(false);
      setReplyTo(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "등록 실패",
        description:
          error instanceof Error
            ? error.message
            : "답변 등록 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleEditAnswer = async (answerId: number) => {
    if (!editAnswerText.trim()) return;

    try {
      await updateAnswer(answerId, {
        answer: editAnswerText,
        private: editAnswerPrivate,
      });

      toast({
        title: "수정 완료",
        description: "답변이 성공적으로 수정되었습니다.",
      });

      // 답변 수정 후 인터뷰 데이터 새로고침
      if (interview) {
        const data = await getInterviewDetail(interview.interviewId);
        setInterview(data);
      }
      setEditingAnswer(null);
      setEditAnswerText("");
      setEditAnswerPrivate(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "수정 실패",
        description:
          error instanceof Error
            ? error.message
            : "답변 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    try {
      await deleteAnswer(answerId);
      toast({
        title: "삭제 완료",
        description: "답변이 삭제되었습니다.",
      });

      // 답변 삭제 후 인터뷰 데이터 새로고침
      if (interview) {
        const data = await getInterviewDetail(interview.interviewId);
        setInterview(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description:
          error instanceof Error
            ? error.message
            : "답변 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  const handleLikeAnswer = async (answer: InterviewAnswer) => {
    if (!interview) return;

    try {
      await likeAnswer(answer.answerId, {
        interviewId: interview.interviewId,
        answer: answer.answer,
        is_private: answer.isPrivate || false,
      });

      // 좋아요 후 인터뷰 데이터 새로고침
      const data = await getInterviewDetail(interview.interviewId);
      setInterview(data);
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "좋아요 실패",
        description: "좋아요 처리 중 오류가 발생했습니다.",
      });
    }
  };

  const startEdit = (answer: InterviewAnswer) => {
    setEditingAnswer(answer.answerId);
    setEditAnswerText(answer.answer);
    setEditAnswerPrivate(answer.isPrivate || false);
  };

  const cancelEdit = () => {
    setEditingAnswer(null);
    setEditAnswerText("");
    setEditAnswerPrivate(false);
  };

  if (isLoading) {
    return (
      <>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">데이터를 불러오는 중...</p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!interview) {
    return (
      <>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              면접 질문을 찾을 수 없습니다.
            </p>
            <Button
              onClick={() => router.push("/interview")}
              className="mt-4"
              variant="outline"
            >
              목록으로
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          ← 돌아가기
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/interview/${interview.interviewId}/edit`)
            }
          >
            수정
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{interview.question}</CardTitle>
          <CardDescription className="flex flex-wrap gap-2 mt-4">
            {interview.categoryList.map((cat) => (
              <span
                key={cat.categoryId}
                className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {cat.categoryName}
              </span>
            ))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            {interview.companyName && (
              <span className="font-medium">{interview.companyName}</span>
            )}
            <span className="text-muted-foreground">
              {interview.questionAt}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 답변 작성 폼 - 일반 답변만 */}
      {!replyTo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Write an answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              disabled={isSubmittingAnswer}
              className="min-h-[120px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(!!checked)}
                  disabled={isSubmittingAnswer}
                />
                <label htmlFor="private" className="text-sm">
                  Private
                </label>
              </div>
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmittingAnswer || !newAnswer.trim()}
              >
                {isSubmittingAnswer ? "Posting..." : "Post Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 답변 목록 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {interview.answer.length} Answers
        </h2>

        {interview.answer.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No answers yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to answer this question!
              </p>
            </CardContent>
          </Card>
        ) : (
          interview.answer.map((ans) => (
            <div key={ans.answerId} className="space-y-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {ans.userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {ans.userId}
                          </span>
                          {ans.isPrivate && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                              Private
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            now
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEdit(ans)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAnswer(ans.answerId)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {editingAnswer === ans.answerId ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editAnswerText}
                            onChange={(e) => setEditAnswerText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-private-${ans.answerId}`}
                                checked={editAnswerPrivate}
                                onCheckedChange={(checked) =>
                                  setEditAnswerPrivate(!!checked)
                                }
                              />
                              <label
                                htmlFor={`edit-private-${ans.answerId}`}
                                className="text-sm"
                              >
                                Private
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditAnswer(ans.answerId)}
                                disabled={!editAnswerText.trim()}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed">
                            {ans.answer}
                          </p>
                          <div className="flex items-center gap-1 pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeAnswer(ans)}
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                              <Heart
                                className={`h-3 w-3 mr-1 ${ans.like > 0 ? "fill-current" : ""}`}
                              />
                              {ans.like}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyTo(ans.answerId)}
                              className={`h-8 px-2 ${
                                replyTo === ans.answerId
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 대댓글 작성 폼 - 인라인 */}
              {replyTo === ans.answerId && (
                <div className="ml-11">
                  <Card className="border-l border-border">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Replying to {ans.userId}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(null)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Write a reply..."
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                          disabled={isSubmittingAnswer}
                          className="min-h-[80px]"
                          autoFocus
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="reply-private"
                              checked={isPrivate}
                              onCheckedChange={(checked) =>
                                setIsPrivate(!!checked)
                              }
                              disabled={isSubmittingAnswer}
                            />
                            <label htmlFor="reply-private" className="text-sm">
                              Private
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyTo(null)}
                              disabled={isSubmittingAnswer}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmitAnswer}
                              disabled={isSubmittingAnswer || !newAnswer.trim()}
                              size="sm"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 대댓글 표시 */}
              {ans.replies && ans.replies.length > 0 && (
                <div className="ml-11 space-y-2">
                  {ans.replies.map((reply) => (
                    <Card key={reply.answerId} className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs">
                              {reply.userId.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {reply.userId}
                                </span>
                                {reply.isPrivate && (
                                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                    Private
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  now
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => startEdit(reply)}
                                  >
                                    <Pencil className="h-3 w-3 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteAnswer(reply.answerId)
                                    }
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {editingAnswer === reply.answerId ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={editAnswerText}
                                  onChange={(e) =>
                                    setEditAnswerText(e.target.value)
                                  }
                                  className="min-h-[60px]"
                                />
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-private-reply-${reply.answerId}`}
                                      checked={editAnswerPrivate}
                                      onCheckedChange={(checked) =>
                                        setEditAnswerPrivate(!!checked)
                                      }
                                    />
                                    <label
                                      htmlFor={`edit-private-reply-${reply.answerId}`}
                                      className="text-sm"
                                    >
                                      Private
                                    </label>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={cancelEdit}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleEditAnswer(reply.answerId)
                                      }
                                      disabled={!editAnswerText.trim()}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm leading-relaxed">
                                  {reply.answer}
                                </p>
                                <div className="flex items-center gap-1 pt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLikeAnswer(reply)}
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                                  >
                                    <Heart
                                      className={`h-3 w-3 mr-1 ${reply.like > 0 ? "fill-current" : ""}`}
                                    />
                                    {reply.like}
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>질문 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
