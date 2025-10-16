"use client";

import { Bookmark, MessageSquare, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "면접 질문 관리",
    description: "실제 면접에서 받은 질문들을 체계적으로 관리하고 공유하세요.",
  },
  {
    icon: Bookmark,
    title: "북마크 기능",
    description: "중요한 면접 질문을 북마크하여 언제든지 다시 확인할 수 있습니다.",
  },
  {
    icon: Users,
    title: "그룹 관리",
    description: "팀원들과 함께 면접 질문을 그룹으로 관리하고 협업하세요.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
              BumaView
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              면접 준비를 더 스마트하게, 더 체계적으로
            </p>
            <p className="text-lg text-muted-foreground/80 mb-12">
              실제 면접 질문을 수집하고 관리하여 취업 준비를 효율적으로 도와드립니다
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/interview">
                  면접 질문 둘러보기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/register">
                  무료로 시작하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              왜 BumaView를 선택해야 할까요?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              면접 준비에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              면접 준비, 이제 더 이상 혼자 하지 마세요
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-4">✍️</div>
                <div className="text-xl font-semibold mb-2">내가 원하는 질문 등록 가능</div>
                <div className="text-muted-foreground">실제 면접에서 받은 질문을 직접 등록하고 관리하세요</div>
              </div>
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-4">✨</div>
                <div className="text-xl font-semibold mb-2">못생긴 문장 AI로 다듬기</div>
                <div className="text-muted-foreground">어색한 질문 문장을 AI가 자연스럽게 다듬어 드려요</div>
              </div>
            </div>

            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/register">
                지금 바로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
