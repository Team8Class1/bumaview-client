"use client";

import { useState } from "react";
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
import { useCreateCompanyMutation } from "@/hooks/use-company-queries";
import { useToast } from "@/hooks/use-toast";
import type { CompanyDto } from "@/types/api";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyAdded: (newCompany: CompanyDto & { companyId: number }) => void;
}

export function AddCompanyDialog({
  open,
  onOpenChange,
  onCompanyAdded,
}: AddCompanyDialogProps) {
  const [companyName, setCompanyName] = useState("");
  const { toast } = useToast();
  const createCompanyMutation = useCreateCompanyMutation();

  const handleAddCompany = () => {
    if (!companyName.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "회사 이름을 입력해주세요.",
      });
      return;
    }

    // This is a optimistic implementation. We assume the backend will assign an ID.
    // The actual ID will be updated upon query refetch.
    const optimisticCompany = {
      companyId: Date.now(), // Temporary ID for optimistic update
      companyName: companyName.trim(),
      companyUrl: "", // companyUrl is not required in the form
    };

    createCompanyMutation.mutate(optimisticCompany, {
      onSuccess: () => {
        toast({
          title: "회사 추가 성공",
          description: `${optimisticCompany.companyName} 회사가 추가되었습니다.`,
        });
        onCompanyAdded(optimisticCompany);
        setCompanyName("");
        onOpenChange(false);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "추가 실패",
          description: error.message || "회사 추가에 실패했습니다.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 회사 추가</DialogTitle>
          <DialogDescription>
            목록에 없는 새로운 회사를 추가합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">회사 이름</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="예: BSSM"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleAddCompany}
            disabled={createCompanyMutation.isPending}
          >
            {createCompanyMutation.isPending ? "추가 중..." : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
