"use client";

import { FullWidthLayout } from '@/components/common/MainLayout';
import SearchBar from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, Users, Building, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Lazy load RecentQuestions component
const RecentQuestions = dynamic(() =>
  import('@/components/question/QuestionCard').then(mod => ({ default: mod.RecentQuestions })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://bumaview.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "BumaView",
              "description": "개발자 면접 질문 공유 플랫폼",
              "url": "https://bumaview.com",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "featureList": [
                "면접 질문 공유",
                "답변 작성 및 공유",
                "회사별 질문 분류",
                "카테고리별 정리"
              ]
            })
          }}
        />
      </Head>
      <FullWidthLayout>
        <main>
        {/* Hero Section */}
        <section className="bg-gray-800 border-b border-gray-700" style={{backgroundColor: 'var(--gray-800)', borderColor: 'var(--gray-700)'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4" style={{color: 'var(--gray-50)'}}>
                개발자 면접 질문 공유 플랫폼
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: 'var(--gray-300)'}}>
                실제 면접에서 받은 질문들을 공유하고, 다른 개발자들과 함께 답변을 준비하세요. <br/>
                함께 성장하는 개발 문화를 만들어갑니다.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <SearchBar className="w-full sm:w-96" />
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/questions/create">
                      질문 등록하기
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href="/questions">
                      질문 둘러보기
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-4" style={{color: 'var(--blue-600)'}} />
                <div className="text-2xl font-bold mb-2" style={{color: 'var(--gray-50)'}}>1,247</div>
                <div style={{color: 'var(--gray-400)'}}>등록된 질문</div>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-4" style={{color: 'oklch(0.696 0.17 162.48)'}} />
                <div className="text-2xl font-bold mb-2" style={{color: 'var(--gray-50)'}}>856</div>
                <div style={{color: 'var(--gray-400)'}}>활성 사용자</div>
              </Card>
              <Card className="p-6 text-center">
                <Building className="h-8 w-8 mx-auto mb-4" style={{color: 'oklch(0.627 0.265 303.9)'}} />
                <div className="text-2xl font-bold mb-2" style={{color: 'var(--gray-50)'}}>123</div>
                <div style={{color: 'var(--gray-400)'}}>등록된 회사</div>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-4" style={{color: 'oklch(0.645 0.246 16.439)'}} />
                <div className="text-2xl font-bold mb-2" style={{color: 'var(--gray-50)'}}>3,421</div>
                <div style={{color: 'var(--gray-400)'}}>총 답변 수</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Questions Section */}
        <section className="py-12" style={{backgroundColor: 'var(--gray-800)'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecentQuestions limit={5} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{color: 'var(--gray-50)'}}>
                주요 기능
              </h2>
              <p className="max-w-2xl mx-auto" style={{color: 'var(--gray-300)'}}>
                면접 준비부터 경험 공유까지, <br/>
                개발자들에게 필요한 모든 기능을 제공합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="text-center">
                  <div className="rounded-full p-3 w-12 h-12 mx-auto mb-4" style={{backgroundColor: 'var(--blue-800)'}}>
                    <BookOpen className="h-6 w-6" style={{color: 'var(--blue-400)'}} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--gray-50)'}}>
                    질문 공유
                  </h3>
                  <p className="mb-4" style={{color: 'var(--gray-300)'}}>
                    실제 면접에서 받은 질문들을 <br/>
                    카테고리별, 회사별로 정리하여 공유하세요.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/questions">
                      질문 보기
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="rounded-full p-3 w-12 h-12 mx-auto mb-4" style={{backgroundColor: 'oklch(0.25 0.15 162.48)'}}>
                    <Users className="h-6 w-6" style={{color: 'oklch(0.696 0.17 162.48)'}} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--gray-50)'}}>
                    답변 공유
                  </h3>
                  <p className="mb-4" style={{color: 'var(--gray-300)'}}>
                    다른 개발자들과 답변을 공유하고 <br/>
                    피드백을 받아 더 나은 답변을 만들어보세요.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/answers">
                      답변 보기
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="rounded-full p-3 w-12 h-12 mx-auto mb-4" style={{backgroundColor: 'oklch(0.25 0.2 303.9)'}}>
                    <Building className="h-6 w-6" style={{color: 'oklch(0.627 0.265 303.9)'}} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--gray-50)'}}>
                    회사별 정보
                  </h3>
                  <p className="mb-4" style={{color: 'var(--gray-300)'}}>
                    각 회사별 면접 정보와 문화, <br/>
                    채용 프로세스 정보를 확인하세요.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/companies">
                      회사 정보
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              지금 시작해보세요
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              면접 질문을 공유하고, 다른 개발자들과 함께 성장하세요. <br/>
              무료로 시작할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-gray-100" asChild>
                <Link href="/auth">
                  무료로 시작하기
                </Link>
              </Button>
              <Button size="lg" className="border border-white text-white bg-transparent hover:bg-blue-700 hover:text-white" asChild>
                <Link href="/questions">
                  질문 둘러보기
                </Link>
              </Button>
            </div>
          </div>
        </section>
        </main>
      </FullWidthLayout>
    </>
  );
}