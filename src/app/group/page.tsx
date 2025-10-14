"use client";

import { Folder, Plus } from "lucide-react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  useCreateGroup,
  useDeleteGroup,
  useGroups,
  useUpdateGroup,
} from "@/hooks/use-group-queries";
import { useToast } from "@/hooks/use-toast";
import type { Group } from "@/lib/api";

export default function GroupPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState("");
  const { toast } = useToast();

  // React Query hooks
  const { data: groupData, isLoading } = useGroups();
  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();

  const groups = groupData?.data || [];

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    createGroupMutation.mutate(
      { name: groupName },
      {
        onSuccess: () => {
          toast({
            title: "그룹 생성",
            description: "그룹이 성공적으로 생성되었습니다.",
          });
          setShowCreateDialog(false);
          setGroupName("");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "그룹 생성 실패",
            description: "그룹 생성에 실패했습니다.",
          });
        },
      },
    );
  };

  const handleUpdateGroup = () => {
    if (!selectedGroup || !groupName.trim()) return;

    updateGroupMutation.mutate(
      {
        id: selectedGroup.groupId.toString(),
        data: { name: groupName },
      },
      {
        onSuccess: () => {
          toast({
            title: "그룹 수정",
            description: "그룹이 성공적으로 수정되었습니다.",
          });
          setShowEditDialog(false);
          setGroupName("");
          setSelectedGroup(null);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "그룹 수정 실패",
            description: "그룹 수정에 실패했습니다.",
          });
        },
      },
    );
  };

  const handleDeleteGroup = () => {
    if (!selectedGroup) return;

    deleteGroupMutation.mutate(selectedGroup.groupId.toString(), {
      onSuccess: () => {
        toast({
          title: "그룹 삭제",
          description: "그룹이 삭제되었습니다.",
        });
        setShowDeleteDialog(false);
        setSelectedGroup(null);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "그룹 삭제 실패",
          description: "그룹 삭제에 실패했습니다.",
        });
      },
    });
  };

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group);
    setGroupName(group.name);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (group: Group) => {
    setSelectedGroup(group);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">그룹 관리</h1>
          <p className="text-muted-foreground mt-2">
            면접 질문을 그룹으로 관리하세요.
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />새 그룹
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">생성된 그룹이 없습니다.</p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
              첫 그룹 만들기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card
              key={group.groupId}
              className="hover:shadow-md transition-shadow"
            >
              <Link href={`/group/${group.groupId}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    {group.createdAt
                      ? new Date(group.createdAt).toLocaleDateString()
                      : ""}
                  </CardDescription>
                </CardHeader>
              </Link>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      openEditDialog(group);
                    }}
                    className="flex-1"
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteDialog(group);
                    }}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 그룹 생성 다이얼로그 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 그룹 만들기</DialogTitle>
            <DialogDescription>
              면접 질문을 관리할 그룹을 만드세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">그룹 이름</Label>
              <Input
                id="group-name"
                placeholder="예: 2024 상반기 면접"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleCreateGroup();
                  }
                }}
                disabled={
                  createGroupMutation.isPending ||
                  updateGroupMutation.isPending ||
                  deleteGroupMutation.isPending
                }
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setGroupName("");
              }}
              disabled={
                createGroupMutation.isPending ||
                updateGroupMutation.isPending ||
                deleteGroupMutation.isPending
              }
            >
              취소
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={createGroupMutation.isPending || !groupName.trim()}
            >
              {createGroupMutation.isPending ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 그룹 수정 다이얼로그 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>그룹 이름 수정</DialogTitle>
            <DialogDescription>그룹의 이름을 변경하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-group-name">그룹 이름</Label>
              <Input
                id="edit-group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleUpdateGroup();
                  }
                }}
                disabled={
                  createGroupMutation.isPending ||
                  updateGroupMutation.isPending ||
                  deleteGroupMutation.isPending
                }
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setGroupName("");
                setSelectedGroup(null);
              }}
              disabled={
                createGroupMutation.isPending ||
                updateGroupMutation.isPending ||
                deleteGroupMutation.isPending
              }
            >
              취소
            </Button>
            <Button
              onClick={handleUpdateGroup}
              disabled={updateGroupMutation.isPending || !groupName.trim()}
            >
              {updateGroupMutation.isPending ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 그룹 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>그룹 삭제</DialogTitle>
            <DialogDescription>
              정말로 "{selectedGroup?.name}" 그룹을 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedGroup(null);
              }}
              disabled={
                createGroupMutation.isPending ||
                updateGroupMutation.isPending ||
                deleteGroupMutation.isPending
              }
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGroup}
              disabled={
                createGroupMutation.isPending ||
                updateGroupMutation.isPending ||
                deleteGroupMutation.isPending
              }
            >
              {deleteGroupMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
