"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TrimmedQuestion {
  id: string;
  original: string;
  trimmed: string;
  improvements: string[];
}

export default function QuestionTrimPage() {
  const [inputText, setInputText] = useState("");
  const [trimmedQuestions, setTrimmedQuestions] = useState<TrimmedQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMode, setProcessingMode] = useState<'single' | 'batch'>('single');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock AI processing
  const processQuestions = async () => {
    if (!inputText.trim()) {
      alert("질문을 입력해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const questions = inputText.split('\n').filter(q => q.trim());
      const results: TrimmedQuestion[] = questions.map((question, index) => ({
        id: `${Date.now()}-${index}`,
        original: question.trim(),
        trimmed: generateTrimmedQuestion(question.trim()),
        improvements: generateImprovements()
      }));

      setTrimmedQuestions(results);
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock functions for AI processing
  const generateTrimmedQuestion = (original: string): string => {
    const improvements = [
      "문법과 맞춤법을 정정했습니다",
      "불필요한 단어를 제거했습니다",
      "더 명확하고 간결하게 표현했습니다",
      "면접 질문 형태로 다듬었습니다"
    ];

    // Simple mock transformation
    return original
      .replace(/음+/g, '')
      .replace(/아+/g, '')
      .replace(/어+/g, '')
      .replace(/그+/g, '')
      .replace(/저+/g, '')
      .replace(/좀+/g, '')
      .replace(/뭔가/g, '')
      .replace(/약간/g, '')
      .trim()
      + (original.endsWith('?') ? '' : '에 대해 설명해주세요.');
  };

  const generateImprovements = (): string[] => {
    const allImprovements = [
      "불필요한 어미 제거",
      "명확한 표현으로 수정",
      "문법 오류 교정",
      "면접 질문 형태로 변환",
      "간결하게 정리",
      "전문적인 용어로 교체"
    ];

    return allImprovements.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert("복사에 실패했습니다.");
    }
  };

  const resetAll = () => {
    setInputText("");
    setTrimmedQuestions([]);
  };

  const sampleTexts = {
    single: "React useEffect에 대해서 아... 그 훅 말이죠. 그거 어떻게 사용하는지 좀 설명해줄 수 있나요?",
    batch: `React useEffect에 대해서 아... 그 훅 말이죠. 그거 어떻게 사용하는지 좀 설명해줄 수 있나요?
JavaScript 클로저가 음... 뭔가 어려운데 좀 쉽게 설명해주실 수 있어요?
데이터베이스 정규화라는게... 저는 잘 모르겠는데 설명 부탁드려요`
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/questions" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>질문 목록으로</span>
            </Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-foreground">AI 질문 다듬기</h1>
          </div>
          <p className="text-muted-foreground">
            AI가 여러분의 질문을 더 명확하고 전문적으로 다듬어드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>질문 입력</span>
                <div className="flex space-x-2">
                  <Button
                    variant={processingMode === 'single' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProcessingMode('single')}
                  >
                    단건
                  </Button>
                  <Button
                    variant={processingMode === 'batch' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProcessingMode('batch')}
                  >
                    일괄
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder={
                    processingMode === 'single'
                      ? "다듬고 싶은 질문을 입력하세요..."
                      : "여러 질문을 입력하세요 (한 줄에 하나씩)..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {/* Sample buttons */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">샘플 사용:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(sampleTexts.single)}
                  >
                    단건 샘플
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(sampleTexts.batch)}
                  >
                    일괄 샘플
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={processQuestions}
                  disabled={isProcessing || !inputText.trim()}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isProcessing ? "처리 중..." : "AI 다듬기 시작"}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetAll}
                  disabled={isProcessing}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Processing indicator */}
              {isProcessing && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        AI가 질문을 분석하고 다듬고 있습니다...
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        잠시만 기다려주세요
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Guidelines */}
              <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  AI 다듬기 기능
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 불필요한 어미와 추임새 제거</li>
                  <li>• 문법과 맞춤법 자동 교정</li>
                  <li>• 면접 질문에 적합한 형태로 변환</li>
                  <li>• 더 명확하고 전문적인 표현으로 개선</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>다듬어진 질문</CardTitle>
            </CardHeader>
            <CardContent>
              {trimmedQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    질문을 입력하고 AI 다듬기를 시작하세요
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {trimmedQuestions.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4">
                      {/* Before/After */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="destructive" className="text-xs">원본</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground bg-red-50 dark:bg-red-900/20 p-3 rounded">
                            {item.original}
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="default" className="text-xs">개선됨</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(item.trimmed, item.id)}
                              className="h-6 px-2"
                            >
                              {copiedId === item.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded font-medium">
                            {item.trimmed}
                          </p>
                        </div>
                      </div>

                      {/* Improvements */}
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">개선 사항:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.improvements.map((improvement, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Bulk Actions */}
                  <div className="flex space-x-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const allTrimmed = trimmedQuestions.map(q => q.trimmed).join('\n');
                        copyToClipboard(allTrimmed, 'all');
                      }}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      모든 결과 복사
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/questions/create">
                        질문 등록하기
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}