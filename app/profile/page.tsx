"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Github, Calendar } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "김개발",
    email: "dev@example.com",
    bio: "5년차 풀스택 개발자입니다.",
    github: "github.com/devkim",
    interests: ["React", "Node.js", "TypeScript"]
  });

  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    { id: "front", label: "프론트엔드" },
    { id: "back", label: "백엔드" },
    { id: "mobile", label: "모바일" },
    { id: "ai", label: "AI/ML" },
    { id: "devops", label: "DevOps" },
    { id: "data", label: "데이터" }
  ];

  const handleSave = () => {
    // Mock save
    setIsEditing(false);
    alert("프로필이 저장되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>프로필 정보</CardTitle>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? "저장" : "편집"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">이름</label>
                    {isEditing ? (
                      <Input 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">이메일</label>
                    {isEditing ? (
                      <Input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">자기소개</label>
                  {isEditing ? (
                    <Textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">GitHub</label>
                  {isEditing ? (
                    <Input 
                      value={profile.github}
                      onChange={(e) => setProfile({...profile, github: e.target.value})}
                      placeholder="github.com/username"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-gray-500" />
                      <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.github}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">관심 분야</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={category.id}
                            checked={profile.interests.includes(category.label)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setProfile({...profile, interests: [...profile.interests, category.label]});
                              } else {
                                setProfile({...profile, interests: profile.interests.filter(i => i !== category.label)});
                              }
                            }}
                          />
                          <label htmlFor={category.id} className="text-sm">{category.label}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>활동 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-500">등록한 질문</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-gray-500">작성한 답변</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-500">받은 좋아요</div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
                  <Calendar className="h-4 w-4" />
                  <span>2023년 3월 가입</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}