"use client";

import { Building2, Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequireAdmin } from "@/components/auth/require-admin";
import {
  useCompanies,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} from "@/hooks/use-company-queries";
import type { CompanyDto, CompanyWithId } from "@/types/api";

export default function CompanyManagePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithId | null>(null);
  const [formData, setFormData] = useState<CompanyDto>({ companyName: "", link: "" });

  const { data: companiesData, isLoading, error } = useCompanies();
  const createCompanyMutation = useCreateCompanyMutation();
  const updateCompanyMutation = useUpdateCompanyMutation();
  const deleteCompanyMutation = useDeleteCompanyMutation();

  // 검색 필터링
  const filteredCompanies = companiesData?.data?.filter((company) =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreate = () => {
    setFormData({ companyName: "", link: "" });
    setShowCreateDialog(true);
  };

  const handleEdit = (company: CompanyWithId) => {
    setSelectedCompany(company);
    setFormData({ companyName: company.companyName, link: company.link });
    setShowEditDialog(true);
  };

  const handleDelete = (company: CompanyWithId) => {
    setSelectedCompany(company);
    setShowDeleteDialog(true);
  };

  const handleSubmitCreate = () => {
    if (!formData.companyName.trim()) return;

    createCompanyMutation.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ companyName: "", link: "" });
      },
    });
  };

  const handleSubmitEdit = () => {
    if (!selectedCompany || !formData.companyName.trim()) return;

    updateCompanyMutation.mutate(
      { companyId: selectedCompany.companyId, data: formData },
      {
        onSuccess: () => {
          setShowEditDialog(false);
          setSelectedCompany(null);
          setFormData({ companyName: "", link: "" });
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedCompany) return;

    deleteCompanyMutation.mutate(selectedCompany.companyId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedCompany(null);
      },
    });
  };

  if (error) {
    return (
      <RequireAdmin>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive">회사 목록을 불러오는데 실패했습니다.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              회사 관리
            </h1>
            <p className="text-muted-foreground mt-2">
              면접 질문에 사용할 회사 정보를 관리할 수 있습니다.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            회사 추가
          </Button>
        </div>

        {/* 검색 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="회사명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 회사</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {companiesData?.data?.length || 0}개
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">검색 결과</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredCompanies.length}개
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 회사 목록 */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <Loading />
            </CardContent>
          </Card>
        ) : !companiesData?.data || companiesData.data.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">등록된 회사가 없습니다.</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 회사 추가하기
              </Button>
            </CardContent>
          </Card>
        ) : filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                검색 조건에 맞는 회사가 없습니다.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")} 
                className="mt-4"
              >
                검색 초기화
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company.companyId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{company.companyName}</h3>
                        {company.link && (
                          <a
                            href={company.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            웹사이트
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(company)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(company)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
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
              <DialogTitle>새 회사 추가</DialogTitle>
              <DialogDescription>
                면접 질문에 사용할 새로운 회사를 추가합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">회사명 *</Label>
                <Input
                  id="name"
                  placeholder="회사명을 입력하세요"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  disabled={createCompanyMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor="link">웹사이트 (선택사항)</Label>
                <Input
                  id="link"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  disabled={createCompanyMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={createCompanyMutation.isPending}
              >
                취소
              </Button>
              <Button
                onClick={handleSubmitCreate}
                disabled={createCompanyMutation.isPending || !formData.companyName.trim()}
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
              <DialogDescription>
                {selectedCompany?.companyName} 회사의 정보를 수정합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">회사명 *</Label>
                <Input
                  id="edit-name"
                  placeholder="회사명을 입력하세요"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  disabled={updateCompanyMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor="edit-link">웹사이트 (선택사항)</Label>
                <Input
                  id="edit-link"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  disabled={updateCompanyMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={updateCompanyMutation.isPending}
              >
                취소
              </Button>
              <Button
                onClick={handleSubmitEdit}
                disabled={updateCompanyMutation.isPending || !formData.companyName.trim()}
              >
                {updateCompanyMutation.isPending ? "수정 중..." : "수정"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 회사 삭제 확인 다이얼로그 */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>회사 삭제 확인</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{selectedCompany?.companyName}</strong> 회사를 삭제하시겠습니까?
                <br />
                이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteCompanyMutation.isPending}>
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteCompanyMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteCompanyMutation.isPending ? "삭제 중..." : "삭제"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RequireAdmin>
  );
}