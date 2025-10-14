"use client";

import { Sparkles } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useInterviewCreateData,
  useTrimInterviewFile,
  useTrimInterviewSingle,
} from "@/hooks/use-interview-queries";
import { useToast } from "@/hooks/use-toast";

export default function InterviewTrimPage() {
  const [mode, setMode] = useState<"single" | "file">("single");
  const [question, setQuestion] = useState("");
  const [trimmedQuestion, setTrimmedQuestion] = useState("");
  const { toast } = useToast();

  // React Query hooks
  const { data: createData } = useInterviewCreateData();
  const trimSingleMutation = useTrimInterviewSingle();
  const trimFileMutation = useTrimInterviewFile();

  const handleTrimSingle = () => {
    if (!question.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "질문을 입력해주세요.",
      });
      return;
    }

    trimSingleMutation.mutate(
      {
        question,
        category: createData?.categoryList || [],
        companyId: null,
        questionAt: new Date().toISOString().split("T")[0],
      },
      {
        onSuccess: (result) => {
          setTrimmedQuestion(result.question);
          toast({
            title: "다듬기 완료",
            description: "질문이 정리되었습니다.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "처리 실패",
            description: "질문 다듬기에 실패했습니다.",
          });
        },
      },
    );
  };

  const handleTrimFile = (file: File) => {
    if (!file) return;

    trimFileMutation.mutate(file, {
      onSuccess: () => {
        toast({
          title: "파일 처리 완료",
          description: "다듬은 파일이 다운로드됩니다.",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "처리 실패",
          description: "파일 처리에 실패했습니다.",
        });
      },
    });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">질문 다듬기</h1>
        <p className="text-muted-foreground mt-2">
          AI가 질문을 더 명확하고 적절하게 다듬어드립니다.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>처리 방식 선택</CardTitle>
          <CardDescription>
            단건 처리 또는 파일 일괄 처리를 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={mode}
            onValueChange={(value: "single" | "file") => setMode(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">단건 처리</SelectItem>
              <SelectItem value="file">파일 일괄 처리</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {mode === "single" ? (
        <Card>
          <CardHeader>
            <CardTitle>단건 질문 다듬기</CardTitle>
            <CardDescription>
              질문을 입력하면 AI가 더 명확하게 다듬어드립니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">원본 질문</div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="다듬을 질문을 입력하세요..."
                className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  trimSingleMutation.isPending || trimFileMutation.isPending
                }
              />
            </div>

            <Button
              onClick={handleTrimSingle}
              disabled={trimSingleMutation.isPending || !question.trim()}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {trimSingleMutation.isPending ? "처리 중..." : "질문 다듬기"}
            </Button>

            {trimmedQuestion && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-sm font-medium mb-2 text-primary">
                  다듬은 질문
                </div>
                <p className="text-sm">{trimmedQuestion}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>파일 일괄 다듬기</CardTitle>
            <CardDescription>
              CSV 파일을 업로드하면 모든 질문을 일괄 처리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleTrimFile(file);
              }}
              className="hidden"
              id="file-trim-upload"
              disabled={
                trimSingleMutation.isPending || trimFileMutation.isPending
              }
            />
            <label
              htmlFor="file-trim-upload"
              className="block border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            >
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">파일을 선택하여 일괄 처리</p>
                <p className="text-sm text-muted-foreground">
                  CSV 파일만 지원 (최대 10MB)
                </p>
              </div>
              <Button
                variant="secondary"
                className="mt-4 pointer-events-none"
                disabled={
                  trimSingleMutation.isPending || trimFileMutation.isPending
                }
              >
                {trimFileMutation.isPending ? "처리 중..." : "파일 선택"}
              </Button>
            </label>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                💡 CSV 형식: question, categoryIds, companyId, questionAt
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>참고:</strong> AI가 질문의 문법, 표현, 명확성을 개선하여 더
          전문적이고 이해하기 쉬운 질문으로 다듬어드립니다.
        </p>
      </div>
    </>
  );
}
