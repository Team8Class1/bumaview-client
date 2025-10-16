"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadInterviewFileMutation } from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";
import { validateCSVFile } from "@/lib/utils/csv";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // React Query hooks
  const uploadFileMutation = useUploadInterviewFileMutation();

  const handleFileSelect = (file: File) => {
    const error = validateCSVFile(file);
    if (error) {
      toast({
        variant: "destructive",
        title: "파일 검증 실패",
        description: error,
      });
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadFileMutation.mutate(
      { file: selectedFile },
      {
        onSuccess: () => {
          toast({
            title: "업로드 성공",
            description: "면접 질문이 성공적으로 등록되었습니다.",
          });
          setSelectedFile(null);
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "업로드 실패",
            description:
              error instanceof Error
                ? error.message
                : "파일 업로드 중 오류가 발생했습니다.",
          });
        },
      },
    );
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">파일 일괄 업로드</DialogTitle>
          <DialogDescription>
            CSV 파일을 사용하여 면접 질문을 일괄 등록하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 파일 업로드 영역 */}
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  파일을 드래그하거나 클릭하여 선택하세요
                </p>
                <p className="text-sm text-muted-foreground">
                  CSV 파일만 지원 (최대 10MB)
                </p>
              </div>
              <Button variant="secondary" className="mt-4 pointer-events-none">
                파일 선택
              </Button>
            </div>
          ) : (
            /* 선택된 파일 표시 */
            <div className="p-4 rounded-lg border bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-700">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-green-700 hover:bg-green-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploadFileMutation.isPending}
          />

          {/* 업로드 버튼 */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploadFileMutation.isPending}
            >
              취소
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadFileMutation.isPending}
            >
              {uploadFileMutation.isPending ? "업로드 중..." : "업로드"}
            </Button>
          </div>

          {/* 안내 메시지 */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">CSV 파일 형식 안내</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 첫 번째 행은 헤더로 사용됩니다</li>
              <li>
                • <strong>현재 지원 형식</strong>: question, category, company,
                question_at
              </li>
              <li>• category: 카테고리명 (예: "백엔드", "프론트엔드")</li>
              <li>• company: 회사명 (예: "마이다스IT")</li>
              <li>• question_at: 연도 (예: "2023")</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
