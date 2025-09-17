"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question } from "@/types/question";
import { Group } from "@/types/group";
import { Calendar, Users, BookOpen, Play, Share, Heart, ArrowLeft, Settings, Plus } from "lucide-react";
import Link from "next/link";

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
  joinedAt: Date;
}

const mockGroup: Group = {
  id: "1",
  name: "프론트엔드 기초 면접 질문",
  description: "React, Vue, Angular 등 프론트엔드 개발 기초 면접 질문 모음입니다. 신입 개발자부터 경력직까지 도움이 될 만한 핵심 질문들을 정리했습니다.",
  userId: "user1",
  questionIds: ["1", "2", "3", "4", "5"],
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20")
};

const mockGroupQuestions: Question[] = [
  {
    id: "1",
    question: "React에서 useEffect의 의존성 배열을 비워두면 어떻게 될까요?",
    category: "프론트엔드",
    company: "카카오",
    question_at: "2023",
    author: "김개발",
    tags: ["React", "Hooks"],
    createdAt: "2024-01-15T10:30:00Z",
    views: 152,
    likes: 23,
    replies: 7
  },
  {
    id: "2", 
    question: "Virtual DOM의 동작 원리에 대해 설명해주세요",
    category: "프론트엔드",
    company: "네이버",
    question_at: "2023",
    author: "이프론트",
    tags: ["React", "Virtual DOM"],
    createdAt: "2024-01-14T15:20:00Z",
    views: 89,
    likes: 15,
    replies: 4
  },
  {
    id: "3",
    question: "JavaScript의 클로저(Closure)란 무엇인가요?",
    category: "프론트엔드",
    company: "토스",
    question_at: "2024",
    author: "박자바",
    tags: ["JavaScript", "Closure"],
    createdAt: "2024-01-13T09:15:00Z",
    views: 234,
    likes: 31,
    replies: 12
  },
  {
    id: "4",
    question: "CSS Flexbox와 Grid의 차이점은 무엇인가요?",
    category: "프론트엔드",
    company: "라인",
    question_at: "2023",
    author: "최시에스",
    tags: ["CSS", "Layout"],
    createdAt: "2024-01-12T14:45:00Z", 
    views: 178,
    likes: 27,
    replies: 9
  },
  {
    id: "5",
    question: "웹 접근성이란 무엇이고 왜 중요한가요?",
    category: "프론트엔드",
    company: "우아한형제들",
    question_at: "2024",
    author: "김접근",
    tags: ["Accessibility", "Web"],
    createdAt: "2024-01-11T11:30:00Z",
    views: 145,
    likes: 19,
    replies: 6
  }
];

const mockGroupMembers: GroupMember[] = [
  {
    id: "user1",
    name: "김개발",
    role: "owner",
    joinedAt: new Date("2024-01-15")
  },
  {
    id: "user2",
    name: "이프론트",
    role: "admin",
    joinedAt: new Date("2024-01-16")
  },
  {
    id: "user3",
    name: "박자바",
    role: "member",
    joinedAt: new Date("2024-01-17")
  },
  {
    id: "user4",
    name: "최시에스",
    role: "member",
    joinedAt: new Date("2024-01-18")
  }
];

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [group, setGroup] = useState<Group | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroup(mockGroup);
      setQuestions(mockGroupQuestions);
      setMembers(mockGroupMembers);
      setLoading(false);
    };
    
    loadGroupData();
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">그룹 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">그룹을 찾을 수 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/groups">그룹 목록으로 돌아가기</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleJoinGroup = () => {
    setIsJoined(!isJoined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 및 액션 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" asChild>
            <Link href="/groups" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>그룹 목록으로</span>
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-1" />
              공유
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              즐겨찾기
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              설정
            </Button>
          </div>
        </div>

        {/* 그룹 헤더 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {group.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{members.length}명 참여</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{questions.length}개 질문</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{group.createdAt.toLocaleDateString('ko-KR')} 생성</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl">
                  {group.description}
                </p>
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={handleJoinGroup}
                    className={isJoined ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isJoined ? "참여 중" : "그룹 참여하기"}
                  </Button>
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    학습 시작
                  </Button>
                  <Button variant="ghost">
                    <Plus className="h-4 w-4 mr-1" />
                    질문 추가
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-500">총 질문</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{members.length}</div>
              <div className="text-sm text-gray-500">참여자</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-500">평균 진도</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">4.5</div>
              <div className="text-sm text-gray-500">평점</div>
            </CardContent>
          </Card>
        </div>

        {/* 탭 콘텐츠 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">질문 목록</TabsTrigger>
            <TabsTrigger value="members">참여자</TabsTrigger>
            <TabsTrigger value="progress">학습 진도</TabsTrigger>
            <TabsTrigger value="discussion">토론</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">질문 목록 ({questions.length})</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                질문 추가
              </Button>
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">
                          <Link href={`/questions/${question.id}`} className="hover:text-blue-600">
                            {question.question}
                          </Link>
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <Badge variant="outline">{question.category}</Badge>
                          <span>{question.company}</span>
                          <span>{question.views} views</span>
                          <span>{question.replies} replies</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.tags?.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">학습</Button>
                        <Button size="sm" variant="ghost">완료</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">참여자 ({members.length})</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                초대하기
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{member.name}</h3>
                          <Badge variant={member.role === 'owner' ? 'default' : member.role === 'admin' ? 'secondary' : 'outline'} className="text-xs">
                            {member.role === 'owner' ? '그룹장' : member.role === 'admin' ? '관리자' : '멤버'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {member.joinedAt.toLocaleDateString('ko-KR')} 참여
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/users/${member.name}`}>프로필</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">학습 진도</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    학습 진도 추적 기능은 곧 출시될 예정입니다.
                  </p>
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    학습 시작하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discussion" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">토론</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                새 토론 시작
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    아직 토론이 없습니다. 첫 번째 토론을 시작해보세요!
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    토론 시작하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}