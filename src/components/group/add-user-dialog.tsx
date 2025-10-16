"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
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
import { useAddUsersToGroupMutation } from "@/hooks/use-group-queries";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  groupName: string;
}

export function AddUserDialog({ 
  open, 
  onOpenChange, 
  groupId, 
  groupName 
}: AddUserDialogProps) {
  const baseId = useId();
  const [userIds, setUserIds] = useState<string[]>([""]);
  const [inputKeys, setInputKeys] = useState<string[]>([`${baseId}-0`]);
  const { toast } = useToast();
  const addUsersMutation = useAddUsersToGroupMutation();

  const handleAddUserIdField = () => {
    setUserIds([...userIds, ""]);
    setInputKeys([...inputKeys, `input-${Date.now()}`]);
  };

  const handleRemoveUserIdField = (index: number) => {
    if (userIds.length > 1) {
      setUserIds(userIds.filter((_, i) => i !== index));
      setInputKeys(inputKeys.filter((_, i) => i !== index));
    }
  };

  const handleUserIdChange = (index: number, value: string) => {
    const newUserIds = [...userIds];
    newUserIds[index] = value;
    setUserIds(newUserIds);
  };

  const handleSubmit = () => {
    const validUserIds = userIds.filter(id => id.trim());
    
    if (validUserIds.length === 0) {
      toast({
        variant: "destructive",
        title: "유저 ID를 입력해주세요",
        description: "최소 하나의 유저 ID를 입력해야 합니다.",
      });
      return;
    }

    addUsersMutation.mutate(
      { 
        groupId, 
        data: { userIdList: validUserIds } 
      },
      {
        onSuccess: () => {
          toast({
            title: "유저 추가 완료",
            description: `${validUserIds.length}명의 유저가 그룹에 추가되었습니다.`,
          });
          setUserIds([""]);
          setInputKeys([`${baseId}-0`]);
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "유저 추가 실패",
            description: error instanceof Error 
              ? error.message 
              : "유저 추가 중 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  const handleClose = () => {
    setUserIds([""]);
    setInputKeys([`${baseId}-0`]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>그룹에 유저 추가</DialogTitle>
          <DialogDescription>
            <strong>{groupName}</strong> 그룹에 추가할 유저의 ID를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label>유저 ID 목록</Label>
          {userIds.map((userId, index) => (
            <div key={inputKeys[index]} className="flex items-center gap-2">
              <Input
                placeholder="유저 ID 입력"
                value={userId}
                onChange={(e) => handleUserIdChange(index, e.target.value)}
                disabled={addUsersMutation.isPending}
              />
              {userIds.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveUserIdField(index)}
                  disabled={addUsersMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUserIdField}
            disabled={addUsersMutation.isPending}
            className="w-full"
          >
            + 유저 ID 추가
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={addUsersMutation.isPending}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addUsersMutation.isPending || userIds.every(id => !id.trim())}
          >
            {addUsersMutation.isPending ? "추가 중..." : "유저 추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
