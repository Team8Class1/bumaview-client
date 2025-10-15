"use client";

import { Building2, ExternalLink, Plus } from "lucide-react";
import { useState } from "react";
import { RequireAdmin } from "@/components/auth/require-admin";
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
  useCompanies,
  useCreateCompany,
  useDeleteCompany,
  useUpdateCompany,
} from "@/hooks/use-company-queries";
import { useToast } from "@/hooks/use-toast";
import type { Company } from "@/lib/api";

export default function AdminCompanyPage() {
  return (
    <RequireAdmin>
      <AdminCompanyContent />
    </RequireAdmin>
  );
}

function AdminCompanyContent() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyLink, setCompanyLink] = useState("");
  const { toast } = useToast();

  // React Query hooks
  const { data: companiesData, isLoading } = useCompanies();
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();

  const companies = companiesData?.data || [];

  const handleCreateCompany = () => {
    if (!companyName.trim()) return;

    createCompanyMutation.mutate(
      { companyName, link: companyLink },
      {
        onSuccess: () => {
          toast({
            title: "회사 생성",
            description: "회사가 성공적으로 생성되었습니다.",
          });
          setShowCreateDialog(false);
          setCompanyName("");
          setCompanyLink("");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "회사 생성 실패",
            description: "회사 생성에 실패했습니다.",
          });
        },
      },
    );
  };

  const handleUpdateCompany = () => {
    if (!selectedCompany || !companyName.trim()) return;

    updateCompanyMutation.mutate(
      {
        id: selectedCompany.companyId.toString(),
        data: { companyName, link: companyLink },
      },
      {
        onSuccess: () => {
          toast({
            title: "회사 수정",
            description: "회사 정보가 성공적으로 수정되었습니다.",
          });
          setShowEditDialog(false);
          setCompanyName("");
          setCompanyLink("");
          setSelectedCompany(null);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "회사 수정 실패",
            description: "회사 수정에 실패했습니다.",
          });
        },
      },
    );
  };

  const handleDeleteCompany = () => {
    if (!selectedCompany) return;

    deleteCompanyMutation.mutate(selectedCompany.companyId, {
      onSuccess: () => {
        toast({
          title: "회사 삭제",
          description: "회사가 삭제되었습니다.",
        });
        setShowDeleteDialog(false);
        setSelectedCompany(null);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "회사 삭제 실패",
          description: "회사 삭제에 실패했습니다.",
        });
      },
    });
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setCompanyName(company.companyName);
    setCompanyLink(company.link);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">회사 관리</h1>
          <p className="text-muted-foreground mt-2">
            면접 질문에 연결할 회사 정보를 관리하세요.
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          회사 추가
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">등록된 회사가 없습니다.</p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
              첫 회사 등록하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Card
              key={company.companyId}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">
                      {company.companyName}
                    </CardTitle>
                  </div>
                </div>
                {company.link && (
                  <CardDescription className="flex items-center gap-1 mt-2 min-w-0">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <a
                      href={company.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline truncate block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {company.link}
                    </a>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(company)}
                    className="flex-1"
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(company)}
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

      {/* 회사 생성 다이얼로그 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회사 추가</DialogTitle>
            <DialogDescription>
              면접 질문에 연결할 회사를 추가하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">회사 이름 *</Label>
              <Input
                id="company-name"
                placeholder="예: 삼성전자"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleCreateCompany();
                  }
                }}
                disabled={
                  createCompanyMutation.isPending ||
                  updateCompanyMutation.isPending ||
                  deleteCompanyMutation.isPending
                }
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-link">웹사이트 링크</Label>
              <Input
                id="company-link"
                placeholder="예: https://www.samsung.com"
                value={companyLink}
                onChange={(e) => setCompanyLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleCreateCompany();
                  }
                }}
                disabled={
                  createCompanyMutation.isPending ||
                  updateCompanyMutation.isPending ||
                  deleteCompanyMutation.isPending
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setCompanyName("");
                setCompanyLink("");
              }}
              disabled={
                createCompanyMutation.isPending ||
                updateCompanyMutation.isPending ||
                deleteCompanyMutation.isPending
              }
            >
              취소
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={createCompanyMutation.isPending || !companyName.trim()}
            >
              {createCompanyMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회사 수정 다이얼로그 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회사 정보 수정</DialogTitle>
            <DialogDescription>회사 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company-name">회사 이름 *</Label>
              <Input
                id="edit-company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleUpdateCompany();
                  }
                }}
                disabled={
                  createCompanyMutation.isPending ||
                  updateCompanyMutation.isPending ||
                  deleteCompanyMutation.isPending
                }
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company-link">웹사이트 링크</Label>
              <Input
                id="edit-company-link"
                value={companyLink}
                onChange={(e) => setCompanyLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleUpdateCompany();
                  }
                }}
                disabled={
                  createCompanyMutation.isPending ||
                  updateCompanyMutation.isPending ||
                  deleteCompanyMutation.isPending
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setCompanyName("");
                setCompanyLink("");
                setSelectedCompany(null);
              }}
              disabled={
                createCompanyMutation.isPending ||
                updateCompanyMutation.isPending ||
                deleteCompanyMutation.isPending
              }
            >
              취소
            </Button>
            <Button
              onClick={handleUpdateCompany}
              disabled={updateCompanyMutation.isPending || !companyName.trim()}
            >
              {updateCompanyMutation.isPending ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회사 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회사 삭제</DialogTitle>
            <DialogDescription>
              정말로 "{selectedCompany?.companyName}" 회사를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedCompany(null);
              }}
              disabled={
                createCompanyMutation.isPending ||
                updateCompanyMutation.isPending ||
                deleteCompanyMutation.isPending
              }
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCompany}
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
