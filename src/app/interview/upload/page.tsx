"use client";

import { Download, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { uploadInterviewFile } from "@/lib/api";
import { downloadSampleCSV, validateCSVFile } from "@/lib/utils/csv";

export default function InterviewUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await uploadInterviewFile(selectedFile);

      if (!response.ok) {
        throw new Error("업로드 실패");
      }

      toast({
        title: "업로드 성공",
        description: "면접 질문이 성공적으로 등록되었습니다.",
      });

      setSelectedFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "업로드 실패",
        description:
          error instanceof Error
            ? error.message
            : "파일 업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">파일 일괄 업로드</CardTitle>
        <CardDescription>
          CSV 파일을 사용하여 면접 질문을 일괄 등록하세요. (관리자 권한 필요)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 샘플 다운로드 */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div>
            <h3 className="font-medium">CSV 샘플 파일</h3>
            <p className="text-sm text-muted-foreground mt-1">
              양식에 맞춰 작성하세요: question, categoryIds, companyId,
              questionAt
            </p>
          </div>
          <Button
            variant="outline"
            onClick={downloadSampleCSV}
            disabled={isUploading}
          >
            <Download className="h-4 w-4 mr-2" />
            샘플 다운로드
          </Button>
        </div>

        {/* 파일 업로드 영역 */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`block border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
          <Button
            variant="secondary"
            className="mt-4 pointer-events-none"
            disabled={isUploading}
          >
            파일 선택
          </Button>
        </label>

        {/* 선택된 파일 정보 */}
        {selectedFile && (
          <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary/10">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              제거
            </Button>
          </div>
        )}

        {/* 업로드 버튼 */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? "업로드 중..." : "업로드"}
        </Button>
      </CardContent>
    </Card>
  );
}
