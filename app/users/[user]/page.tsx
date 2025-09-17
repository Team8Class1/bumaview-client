"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/question/QuestionCard";
import { Question } from "@/types/question";
import { Calendar, Github, MapPin, Award, TrendingUp, BookOpen, MessageCircle, Star } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  location?: string;
  github?: string;
  email?: string;
  joinedAt: Date;
  stats: {
    questionsCount: number;
    answersCount: number;
    likesReceived: number;
    bestAnswers: number;
    reputation: number;
  };
  interests: string[];
  badges: {
    name: string;
    icon: string;
    description: string;
    earnedAt: Date;
  }[];
  level: string;
  avatar?: string;
}

interface UserActivity {
  id: string;
  type: 'question' | 'answer' | 'like' | 'badge';
  title: string;
  description: string;
  createdAt: Date;
  link?: string;
}

const mockUserProfile: UserProfile = {
  id: "user1",
  username: "김개발",
  displayName: "김개발",
  bio: "3년차 프론트엔드 개발자입니다. React, TypeScript, Next.js를 주로 사용하며, 좋은 코드와 사용자 경험에 관심이 많습니다.",
  location: "서울, 대한민국",
  github: "kimdev",
  email: "kimdev@example.com",
  joinedAt: new Date("2023-03-15"),
  stats: {
    questionsCount: 12,
    answersCount: 28,
    likesReceived: 156,
    bestAnswers: 8,
    reputation: 892
  },
  interests: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  badges: [
    {
      name: "첫 질문",
      icon: "🎯",
      description: "첫 번째 질문을 등록했습니다",
      earnedAt: new Date("2023-03-16")
    },
    {
      name: "도움이 되는 답변",
      icon: "⭐",
      description: "답변이 10번 이상 좋아요를 받았습니다",
      earnedAt: new Date("2023-04-10")
    },
    {
      name: "베스트 답변자",
      icon: "🏆",
      description: "5개 이상의 베스트 답변을 작성했습니다",
      earnedAt: new Date("2023-06-20")
    }
  ],
  level: "시니어",
  avatar: "https://ui-avatars.com/api/?name=김개발&background=3B82F6&color=fff"
};

const mockUserQuestions: Question[] = [
  {
    id: "1",
    question: "React 18에서 새로 추가된 useId Hook의 사용법이 궁금합니다",
    category: "프론트엔드",
    company: "카카오",
    question_at: "2024",
    author: "김개발",
    tags: ["React", "Hooks"],
    createdAt: "2024-01-15T10:30:00Z",
    views: 89,
    likes: 12,
    replies: 5
  },
  {
    id: "2",
    question: "Next.js 14의 App Router에서 동적 라우팅 구현 방법",
    category: "프론트엔드",
    company: "토스",
    question_at: "2024",
    author: "김개발",
    tags: ["Next.js", "Routing"],
    createdAt: "2024-01-10T14:20:00Z",
    views: 156,
    likes: 18,
    replies: 8
  }
];

const mockUserActivity: UserActivity[] = [
  {
    id: "1",
    type: "answer",
    title: "베스트 답변 선정",
    description: "'useEffect 의존성 배열' 질문에 대한 답변이 베스트 답변으로 선정되었습니다",
    createdAt: new Date("2024-01-15T16:30:00Z"),
    link: "/questions/1"
  },
  {
    id: "2",
    type: "question",
    title: "새 질문 등록",
    description: "React 18에서 새로 추가된 useId Hook의 사용법이 궁금합니다",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    link: "/questions/1"
  },
  {
    id: "3",
    type: "badge",
    title: "새 배지 획득",
    description: "'베스트 답변자' 배지를 획득했습니다",
    createdAt: new Date("2024-01-10T09:15:00Z")
  },
  {
    id: "4",
    type: "like",
    title: "좋아요 받음",
    description: "Next.js 동적 라우팅 답변이 5번의 좋아요를 받았습니다",
    createdAt: new Date("2024-01-08T14:45:00Z")
  }
];

export default function UserPage() {
  const params = useParams();
  const username = params.user as string;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock data loading
    const loadUserData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserProfile(mockUserProfile);
      setUserQuestions(mockUserQuestions);
      setUserActivity(mockUserActivity);
      setLoading(false);
    };
    
    loadUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">사용자 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">사용자를 찾을 수 없습니다.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 사용자 프로필 사이드바 */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.displayName.charAt(0)}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {userProfile.displayName}
                  </h1>
                  <Badge variant="secondary" className="mb-2">{userProfile.level}</Badge>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {userProfile.bio}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{userProfile.joinedAt.toLocaleDateString('ko-KR')} 가입</span>
                  </div>
                  {userProfile.location && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.github && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Github className="h-4 w-4" />
                      <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {userProfile.github}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">관심 분야</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 통계 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">활동 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">등록한 질문</span>
                  </div>
                  <span className="font-bold text-blue-600">{userProfile.stats.questionsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">작성한 답변</span>
                  </div>
                  <span className="font-bold text-green-600">{userProfile.stats.answersCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">베스트 답변</span>
                  </div>
                  <span className="font-bold text-yellow-600">{userProfile.stats.bestAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">받은 좋아요</span>
                  </div>
                  <span className="font-bold text-purple-600">{userProfile.stats.likesReceived}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">평판 점수</span>
                    <span className="font-bold text-lg text-blue-600">{userProfile.stats.reputation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 배지 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">획득 배지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProfile.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-gray-500">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="questions">등록한 질문</TabsTrigger>
                <TabsTrigger value="answers">작성한 답변</TabsTrigger>
                <TabsTrigger value="activity">최근 활동</TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">등록한 질문 ({userProfile.stats.questionsCount})</h2>
                </div>
                {userQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {userQuestions.map((question) => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">등록한 질문이 없습니다.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="answers" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">작성한 답변 ({userProfile.stats.answersCount})</h2>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    답변 목록 기능은 곧 출시될 예정입니다.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/answers">전체 답변 보기</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">최근 활동</h2>
                </div>
                <div className="space-y-4">
                  {userActivity.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            {activity.type === 'question' && <BookOpen className="h-4 w-4 text-blue-600" />}
                            {activity.type === 'answer' && <MessageCircle className="h-4 w-4 text-green-600" />}
                            {activity.type === 'like' && <Star className="h-4 w-4 text-yellow-600" />}
                            {activity.type === 'badge' && <Award className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{activity.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {activity.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {activity.createdAt.toLocaleDateString('ko-KR')}
                              </span>
                              {activity.link && (
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={activity.link}>보기</Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}