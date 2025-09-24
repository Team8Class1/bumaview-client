"use client";

import { useState, useCallback, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, Download, CheckCircle, AlertCircle, FileText, X } from "lucide-react";
import Link from "next/link";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  questionCount?: number;
  errorMessage?: string;
}

interface PreviewQuestion {
  question: string;
  category: string;
  company: string;
  year: string;
  row: number;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<PreviewQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSample = () => {
    const sampleData = [
      ['질문 내용', '카테고리', '회사명', '면접 연도'],
      ['React의 useEffect 훅에 대해 설명해주세요', 'front', '카카오', '2024'],
      ['데이터베이스 정규화에 대해 설명해주세요', 'back', '네이버', '2024'],
      ['머신러닝과 딥러닝의 차이점을 설명해주세요', 'ai', '삼성전자', '2024']
    ];

    const csvContent = sampleData.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_questions.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): PreviewQuestion[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/"/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/"/g, ''));

        return {
          question: values[0] || '',
          category: values[1] || '',
          company: values[2] || '',
          year: values[3] || '2024',
          row: index + 2
        };
      })
      .filter(q => q.question && q.question.trim() !== '');
  };

  const processFile = async (file: File) => {
    const fileId = Date.now().toString();
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f =>
          f.name === file.name ? { ...f, progress: i } : f
        ));
      }

      // Change status to processing
      setFiles(prev => prev.map(f =>
        f.name === file.name ? { ...f, status: 'processing' } : f
      ));

      // Read and parse file
      const text = await file.text();
      const questions = parseCSV(text);

      if (questions.length === 0) {
        throw new Error('올바른 형식의 질문을 찾을 수 없습니다.');
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFiles(prev => prev.map(f =>
        f.name === file.name ? {
          ...f,
          status: 'completed',
          progress: 100,
          questionCount: questions.length
        } : f
      ));

      setPreviewQuestions(questions);
      setShowPreview(true);

    } catch (error) {
      setFiles(prev => prev.map(f =>
        f.name === file.name ? {
          ...f,
          status: 'error',
          errorMessage: error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.'
        } : f
      ));
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        alert('CSV 파일만 업로드 가능합니다.');
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(file => {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        alert('CSV 파일만 업로드 가능합니다.');
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    if (files.length === 1) {
      setShowPreview(false);
      setPreviewQuestions([]);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement actual submission to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${previewQuestions.length}개의 질문이 성공적으로 등록되었습니다!`);
      setFiles([]);
      setPreviewQuestions([]);
      setShowPreview(false);
    } catch (error) {
      alert('질문 등록 중 오류가 발생했습니다.');
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>파일 업로드</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Download */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">샘플 파일</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">형식을 확인하고 다운로드하세요</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadSample}>
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </Button>
                  </div>

                  {/* Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center transition-colors
                      ${isDragOver
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border hover:border-blue-300'
                      }
                    `}
                  >
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      CSV 파일을 여기에 드래그하세요
                    </p>
                    <p className="text-muted-foreground mb-4">
                      또는 클릭해서 파일을 선택하세요
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      파일 선택
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium">업로드된 파일</h3>
                      {files.map((file, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium truncate">{file.name}</span>
                              {file.status === 'completed' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              {file.status === 'error' && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.name)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {file.status === 'uploading' || file.status === 'processing' ? (
                            <div className="space-y-2">
                              <Progress value={file.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {file.status === 'uploading' ? '업로드 중...' : '파일 분석 중...'}
                              </p>
                            </div>
                          ) : file.status === 'completed' ? (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {file.questionCount}개의 질문을 찾았습니다
                            </p>
                          ) : file.status === 'error' ? (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {file.errorMessage}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  {showPreview && previewQuestions.length > 0 && (
                    <Button onClick={handleSubmit} className="w-full">
                      {previewQuestions.length}개 질문 등록하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>업로드 가이드라인</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• CSV 파일 형식만 지원됩니다</p>
                <p>• 첫 번째 행은 헤더여야 합니다</p>
                <p>• 필수 컬럼: 질문 내용, 카테고리, 회사명, 면접 연도</p>
                <p>• 최대 파일 크기: 10MB</p>
                <p>• 한 번에 최대 1,000개 질문까지 업로드 가능</p>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div>
            {showPreview && previewQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>미리보기</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    총 {previewQuestions.length}개의 질문
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {previewQuestions.slice(0, 10).map((question, index) => (
                      <div key={index} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium line-clamp-2">
                            {question.question}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            #{question.row}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                            {question.category}
                          </span>
                          <span>{question.company}</span>
                          <span>{question.year}</span>
                        </div>
                      </div>
                    ))}

                    {previewQuestions.length > 10 && (
                      <div className="text-center p-4 text-muted-foreground">
                        그 외 {previewQuestions.length - 10}개의 질문이 더 있습니다
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}