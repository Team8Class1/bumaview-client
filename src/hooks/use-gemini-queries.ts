import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { geminiAPI } from "@/lib/api/gemini";

// Gemini AI 질문 다듬기 뮤테이션
export function useTrimQuestionMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: geminiAPI.trimSingle,
    onSuccess: (trimmedQuestion: string) => {
      console.log("🎉 질문 다듬기 성공:", trimmedQuestion);
      toast({
        title: "질문 다듬기 완료",
        description: "AI가 질문을 다듬었습니다.",
      });
    },
    onError: (error: any) => {
      console.error("❌ 질문 다듬기 실패:", error);
      toast({
        variant: "destructive",
        title: "질문 다듬기 실패",
        description:
          error?.message || "AI 질문 다듬기에 실패했습니다. 다시 시도해주세요.",
      });
    },
  });
}
