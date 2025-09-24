"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Eye,
  EyeOff,
  Shuffle,
  Play,
  Building,
  Calendar,
  ChevronLeft,
  Settings,
  Timer,
  Target,
  BookMarked,
  Star,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  SkipForward,
  Pause,
  Volume2
} from "lucide-react";
import Link from "next/link";
import { Question } from "@/types/question";
import Head from "next/head";

interface StudySession {
  startTime: Date;
  currentIndex: number;
  completed: Set<string>;
  difficult: Set<string>;
  easy: Set<string>;
  skipped: Set<string>;
  studySettings: StudySettings;
  studyQuestions: Question[];
}

interface StudySettings {
  category: string;
  company: string;
  shuffle: boolean;
  count: number;
  difficulty: 'all' | 'hard' | 'medium' | 'easy';
  timerEnabled: boolean;
  timerDuration: number;
}

interface StudyStats {
  totalTime: number;
  averageTimePerQuestion: number;
  correctAnswers: number;
  difficultQuestions: number;
  easyQuestions: number;
  skippedQuestions: number;
}

export default function StudyPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [studyQuestions, setStudyQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'setup' | 'flashcard' | 'review'>('setup');
  const [loading, setLoading] = useState(true);
  const [studySettings, setStudySettings] = useState<StudySettings>({
    category: '',
    company: '',
    shuffle: true,
    count: 10,
    difficulty: 'all',
    timerEnabled: false,
    timerDuration: 30
  });
  const [studyProgress, setStudyProgress] = useState({
    current: 0,
    total: 0,
    completed: new Set<string>(),
    difficult: new Set<string>(),
    easy: new Set<string>(),
    skipped: new Set<string>()
  });
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionStats, setSessionStats] = useState<StudyStats>({
    totalTime: 0,
    averageTimePerQuestion: 0,
    correctAnswers: 0,
    difficultQuestions: 0,
    easyQuestions: 0,
    skippedQuestions: 0
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced mock answers based on common interview questions
  const generateAnswer = useCallback((question: Question): string => {
    const q = question.question.toLowerCase();

    if (q.includes('useeffect')) {
      return "useEffect는 React의 Hook 중 하나로, 함수형 컴포넌트에서 side effect를 처리할 때 사용합니다.\n\n주요 특징:\n• 컴포넌트 렌더링 후 실행되는 작업을 처리\n• 의존성 배열로 실행 조건 제어\n• cleanup 함수로 메모리 누수 방지\n\n예시:\n```javascript\nuseEffect(() => {\n  const timer = setInterval(() => {\n    console.log('tick');\n  }, 1000);\n  \n  return () => clearInterval(timer);\n}, []);\n```";
    } else if (q.includes('클로저') || q.includes('closure')) {
      return "클로저(Closure)는 함수가 선언될 때의 렉시컬 환경을 기억하는 JavaScript의 핵심 개념입니다.\n\n주요 특징:\n• 외부 함수의 변수에 접근 가능\n• 변수의 생명주기 연장\n• 데이터 은닉화와 캡슐화 구현\n\n예시:\n```javascript\nfunction outerFunction(x) {\n  return function(y) {\n    return x + y;\n  };\n}\n\nconst addFive = outerFunction(5);\nconsole.log(addFive(3)); // 8\n```";
    } else if (q.includes('정규화') || q.includes('normalization')) {
      return "데이터베이스 정규화는 중복을 최소화하고 데이터 무결성을 보장하는 설계 기법입니다.\n\n정규화 단계:\n• 1NF: 원자값만 저장, 중복 그룹 제거\n• 2NF: 부분 함수 종속성 제거\n• 3NF: 이행적 함수 종속성 제거\n• BCNF: 모든 결정자가 후보키\n\n장점:\n- 데이터 중복 최소화\n- 업데이트 이상 현상 방지\n- 저장 공간 효율성";
    } else if (q.includes('자기소개') || q.includes('소개')) {
      return "효과적인 자기소개의 구조:\n\n1. 인사 및 기본 정보\n- 이름, 전공, 경력 요약\n\n2. 핵심 역량 및 경험\n- 주요 기술 스택\n- 대표 프로젝트 소개\n- 성과 및 학습 경험\n\n3. 지원 동기\n- 회사/직무에 대한 관심\n- 기여할 수 있는 부분\n\n4. 마무리\n- 성장 의지 및 목표\n\n💡 TIP: 1-2분 내외로 간결하게, 구체적인 수치나 사례를 포함하여 설득력을 높이세요.";
    } else if (q.includes('프로젝트')) {
      return "프로젝트 소개 시 포함할 요소:\n\n1. 프로젝트 개요\n- 목적 및 배경\n- 개발 기간 및 팀 구성\n\n2. 기술적 구현\n- 사용 기술 스택\n- 아키텍처 설계\n- 핵심 기능 구현\n\n3. 도전과 해결\n- 마주한 기술적 문제\n- 해결 과정 및 방법\n- 학습한 내용\n\n4. 성과 및 결과\n- 정량적 성과 (성능 개선, 사용자 수 등)\n- 개인적 성장\n\n💡 TIP: 구체적인 수치와 기술적 깊이를 보여주되, 청중 수준에 맞춰 설명하세요.";
    } else if (q.includes('동기') || q.includes('지원')) {
      return "지원 동기 답변 구조:\n\n1. 회사/직무 관심 계기\n- 구체적인 발견 경로\n- 인상 깊었던 점\n\n2. 회사와의 가치 일치\n- 회사 미션/비전 공감\n- 개인 가치관과의 연결\n\n3. 역량과 기여 방안\n- 보유 역량의 활용성\n- 구체적 기여 계획\n\n4. 성장 가능성\n- 회사에서의 성장 비전\n- 상호 발전 가능성\n\n💡 TIP: 회사 홈페이지, 뉴스, 기술 블로그 등을 통해 충분히 리서치하고 진정성 있게 답변하세요.";
    }

    // Generate generic answer based on category
    const category = question.category;
    if (category === 'front') {
      return "프론트엔드 개발 관련 질문입니다.\n\n답변 시 고려사항:\n• 사용자 경험(UX) 관점에서 접근\n• 성능 최적화 방안\n• 브라우저 호환성\n• 최신 기술 트렌드 반영\n• 실제 프로젝트 경험 활용\n\n구체적인 코드 예시나 경험을 통해 답변하시면 더욱 효과적입니다.";
    } else if (category === 'back') {
      return "백엔드 개발 관련 질문입니다.\n\n답변 시 고려사항:\n• 시스템 아키텍처 설계\n• 데이터베이스 최적화\n• 보안 및 인증\n• 확장성과 성능\n• API 설계 원칙\n\n실제 서비스 운영 경험이나 트래픽 처리 사례를 포함하면 좋습니다.";
    } else if (category === 'ai') {
      return "AI/머신러닝 관련 질문입니다.\n\n답변 시 고려사항:\n• 알고리즘 이해도\n• 데이터 전처리 경험\n• 모델 선택 기준\n• 성능 평가 지표\n• 실제 적용 사례\n\n이론과 실습을 균형있게 설명하고, 최신 트렌드도 언급해보세요.";
    }

    return `"${question.question}"\n\n이 질문에 대해 다음과 같이 접근해보세요:\n\n1. 핵심 개념 정의\n2. 구체적인 예시나 경험\n3. 장단점 분석\n4. 실무 적용 방안\n\n💡 면접관이 궁금해할 포인트:\n- 실제 경험 유무\n- 깊이 있는 이해도\n- 문제 해결 능력\n- 학습 의지`;
  }, []);

  // CSV 파싱 함수
  const parseCSVLine = useCallback((line: string) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }, []);

  // CSV 데이터 로드
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/interview.csv', {
          cache: 'force-cache',
        });
        const text = await response.text();
        const lines = text.split('\n');

        const csvQuestions = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = parseCSVLine(line);
            const [question, category, company, question_at] = values;
            return {
              id: (index + 1).toString(),
              question: question?.replace(/"/g, '') || '',
              category: category || '',
              company: company || '',
              question_at: question_at || '',
              likes: Math.floor(Math.random() * 50),
              views: Math.floor(Math.random() * 200) + 10,
              createdAt: question_at || '2023',
              author: '익명',
              tags: category ? [category] : [],
              replies: Math.floor(Math.random() * 20)
            };
          })
          .filter(q => q.question && q.question.trim() !== '');

        setAllQuestions(csvQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [parseCSVLine]);

  // Timer effects
  useEffect(() => {
    if (isTimerRunning && studySettings.timerEnabled) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Auto advance to answer when timer expires
            setShowAnswer(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, studySettings.timerEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (studyMode !== 'flashcard') return;

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          prevQuestion();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextQuestion();
          break;
        case 'Space':
          e.preventDefault();
          setShowAnswer(prev => !prev);
          break;
        case 'KeyH':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            markAs('difficult');
          }
          break;
        case 'KeyE':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            markAs('easy');
          }
          break;
        case 'KeyS':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            markAs('skipped');
          }
          break;
        case 'Escape':
          e.preventDefault();
          resetStudy();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [studyMode, currentIndex, studyQuestions.length]);

  // 고유한 카테고리와 회사 목록 생성
  const categories = [...new Set(allQuestions.map(q => q.category).filter(Boolean))];
  const companies = [...new Set(allQuestions.map(q => q.company).filter(Boolean))];

  const startStudy = () => {
    let filtered = [...allQuestions];

    // 필터링
    if (studySettings.category) {
      filtered = filtered.filter(q => q.category === studySettings.category);
    }
    if (studySettings.company) {
      filtered = filtered.filter(q => q.company === studySettings.company);
    }

    // 셔플
    if (studySettings.shuffle) {
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    // 개수 제한
    const finalQuestions = filtered.slice(0, studySettings.count);

    // 세션 시작
    const newSession: StudySession = {
      startTime: new Date(),
      currentIndex: 0,
      completed: new Set(),
      difficult: new Set(),
      easy: new Set(),
      skipped: new Set(),
      studySettings,
      studyQuestions: finalQuestions
    };

    setStudySession(newSession);
    setStudyQuestions(finalQuestions);
    setCurrentIndex(0);
    setShowAnswer(false);
    setStudyMode('flashcard');
    setStudyProgress({
      current: 1,
      total: finalQuestions.length,
      completed: new Set(),
      difficult: new Set(),
      easy: new Set(),
      skipped: new Set()
    });

    // 타이머 초기화
    if (studySettings.timerEnabled) {
      setTimer(studySettings.timerDuration);
      setIsTimerRunning(true);
    }

    // 세션 저장 (LocalStorage)
    localStorage.setItem('bumaview_study_session', JSON.stringify({
      ...newSession,
      completed: Array.from(newSession.completed),
      difficult: Array.from(newSession.difficult),
      easy: Array.from(newSession.easy),
      skipped: Array.from(newSession.skipped)
    }));
  };

  const markAs = (type: 'completed' | 'difficult' | 'easy' | 'skipped') => {
    const currentQuestion = studyQuestions[currentIndex];
    if (!currentQuestion) return;

    setStudyProgress(prev => {
      const newProgress = { ...prev };

      // 이전 마킹 제거
      newProgress.completed.delete(currentQuestion.id);
      newProgress.difficult.delete(currentQuestion.id);
      newProgress.easy.delete(currentQuestion.id);
      newProgress.skipped.delete(currentQuestion.id);

      // 새 마킹 추가
      newProgress[type].add(currentQuestion.id);

      return newProgress;
    });

    // 세션 업데이트
    if (studySession) {
      const updatedSession = { ...studySession };
      updatedSession[type].add(currentQuestion.id);
      setStudySession(updatedSession);
    }
  };

  const startTimer = () => {
    if (studySettings.timerEnabled) {
      setTimer(studySettings.timerDuration);
      setIsTimerRunning(true);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < studyQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setStudyProgress(prev => ({
        ...prev,
        current: prev.current + 1
      }));
      startTimer(); // Restart timer for new question
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setStudyProgress(prev => ({
        ...prev,
        current: prev.current - 1
      }));
      startTimer(); // Restart timer for previous question
    }
  };

  const resetStudy = () => {
    setStudyMode('setup');
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsTimerRunning(false);
    setTimer(0);
    setStudyProgress({
      current: 0,
      total: 0,
      completed: new Set(),
      difficult: new Set(),
      easy: new Set(),
      skipped: new Set()
    });
    setStudySession(null);
    localStorage.removeItem('bumaview_study_session');
  };

  const finishStudy = () => {
    const totalTime = studySession ?
      (new Date().getTime() - studySession.startTime.getTime()) / 1000 / 60 : 0; // minutes

    const stats: StudyStats = {
      totalTime: Math.round(totalTime),
      averageTimePerQuestion: Math.round(totalTime / studyProgress.total),
      correctAnswers: studyProgress.completed.size,
      difficultQuestions: studyProgress.difficult.size,
      easyQuestions: studyProgress.easy.size,
      skippedQuestions: studyProgress.skipped.size
    };

    setSessionStats(stats);
    setStudyMode('review');
    setIsTimerRunning(false);
  };

  const currentQuestion = studyQuestions[currentIndex];
  const currentAnswer = currentQuestion ? generateAnswer(currentQuestion) : '';
  const progressPercentage = studyProgress.total > 0 ? (studyProgress.current / studyProgress.total) * 100 : 0;
  const completedCount = studyProgress.completed.size;
  const difficultCount = studyProgress.difficult.size;
  const easyCount = studyProgress.easy.size;
  const skippedCount = studyProgress.skipped.size;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId: string): 'completed' | 'difficult' | 'easy' | 'skipped' | null => {
    if (studyProgress.completed.has(questionId)) return 'completed';
    if (studyProgress.difficult.has(questionId)) return 'difficult';
    if (studyProgress.easy.has(questionId)) return 'easy';
    if (studyProgress.skipped.has(questionId)) return 'skipped';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">학습 데이터를 준비하는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>면접 질문 학습하기 | BumaView</title>
        <meta name="description" content="플래시카드 방식으로 면접 질문을 학습하고 실력을 향상시키세요" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ChevronLeft className="h-4 w-4" />
                <span>홈으로</span>
              </Link>
            </Button>
          </div>

        {studyMode === 'setup' ? (
          // Study Setup
          <div className="space-y-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <h1 className="text-4xl font-bold mb-4">
                  🎯 면접 질문 학습하기
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                AI 기반 플래시카드로 체계적인 면접 준비를 시작하세요
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">{allQuestions.length}+ 질문</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <BookMarked className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">스마트 학습</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <Timer className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">타이머 지원</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">진도 추적</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>학습 설정</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        📂 카테고리
                      </label>
                      <select
                        value={studySettings.category}
                        onChange={(e) => setStudySettings(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="">🌐 전체 카테고리</option>
                        <option value="front">⚛️ 프론트엔드</option>
                        <option value="back">🔧 백엔드</option>
                        <option value="ai">🤖 AI/ML</option>
                        <option value="mobile">📱 모바일</option>
                        <option value="devops">☁️ DevOps</option>
                        <option value="data">📊 데이터</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        🏢 회사
                      </label>
                      <select
                        value={studySettings.company}
                        onChange={(e) => setStudySettings(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="">🌍 전체 회사</option>
                        {companies.slice(0, 15).map(company => (
                          <option key={company} value={company}>{company}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      📊 질문 개수: <span className="text-blue-600 font-bold">{studySettings.count}개</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={studySettings.count}
                      onChange={(e) => setStudySettings(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>⚡ 빠른 학습 (5개)</span>
                      <span>🔥 집중 학습 (50개)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      ⏱️ 타이머 설정
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="timerEnabled"
                          checked={studySettings.timerEnabled}
                          onChange={(e) => setStudySettings(prev => ({ ...prev, timerEnabled: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="timerEnabled" className="text-sm text-foreground">
                          타이머 사용하기
                        </label>
                      </div>

                      {studySettings.timerEnabled && (
                        <div className="ml-7">
                          <label className="block text-xs text-muted-foreground mb-2">
                            질문당 시간: {studySettings.timerDuration}초
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="120"
                            step="10"
                            value={studySettings.timerDuration}
                            onChange={(e) => setStudySettings(prev => ({ ...prev, timerDuration: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>10초</span>
                            <span>120초</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Shuffle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <input
                        type="checkbox"
                        id="shuffle"
                        checked={studySettings.shuffle}
                        onChange={(e) => setStudySettings(prev => ({ ...prev, shuffle: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 rounded mr-3"
                      />
                      <label htmlFor="shuffle" className="text-sm font-medium text-foreground">
                        질문 순서 무작위로 섞기
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        더 효과적인 학습을 위해 권장합니다
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={startStudy}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    🚀 학습 시작하기
                  </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        ) : (
          // Flashcard Mode
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {studyProgress.current} / {studyProgress.total}
                </span>
                <span className="text-muted-foreground">
                  완료: {completedCount}개
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={resetStudy}>
                <Settings className="h-4 w-4 mr-2" />
                설정으로
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={nextQuestion}
                  disabled={currentIndex === studyQuestions.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <Card className="min-h-[400px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{currentQuestion.category}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        <span>{currentQuestion.company}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{currentQuestion.question_at}</span>
                      </div>
                    </div>
                    {studyProgress.completed.has(currentQuestion.id) && (
                      <Badge variant="default" className="bg-green-500">
                        완료
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Q. {currentQuestion.question}
                    </h2>
                  </div>

                  {showAnswer ? (
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h3 className="font-medium text-foreground mb-3 flex items-center space-x-2">
                          <span>💡 모범 답변</span>
                        </h3>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                            {currentAnswer}
                          </pre>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setShowAnswer(false)}
                        >
                          <EyeOff className="h-4 w-4 mr-2" />
                          답변 숨기기
                        </Button>
                        <Button
                          onClick={() => markAs('completed')}
                          disabled={studyProgress.completed.has(currentQuestion.id)}
                        >
                          {studyProgress.completed.has(currentQuestion.id) ? '완료됨' : '완료 표시'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 py-8">
                      <p className="text-muted-foreground text-center">
                        먼저 스스로 답변을 생각해보세요
                      </p>
                      <Button onClick={() => setShowAnswer(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        답변 보기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Study Complete */}
            {currentIndex === studyQuestions.length - 1 && showAnswer && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                    🎉 학습 완료!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    총 {studyProgress.total}개 중 {completedCount}개의 질문을 완료했습니다
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={resetStudy}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      다시 시작
                    </Button>
                    <Button asChild>
                      <Link href="/questions">
                        더 많은 질문 보기
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
    </>
  );
}