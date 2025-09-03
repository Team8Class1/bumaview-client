import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SearchBar from '@/components/common/SearchBar';
import { RecentQuestions } from '@/components/question/QuestionCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, Users, Building, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-800 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                개발자 면접 질문 공유 플랫폼
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
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
                <BookOpen className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1,247</div>
                <div className="text-gray-600 dark:text-gray-400">등록된 질문</div>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-4 text-green-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">856</div>
                <div className="text-gray-600 dark:text-gray-400">활성 사용자</div>
              </Card>
              <Card className="p-6 text-center">
                <Building className="h-8 w-8 mx-auto mb-4 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">123</div>
                <div className="text-gray-600 dark:text-gray-400">등록된 회사</div>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-4 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">3,421</div>
                <div className="text-gray-600 dark:text-gray-400">총 답변 수</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Questions Section */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecentQuestions limit={5} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                주요 기능
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                면접 준비부터 경험 공유까지, <br/>
                개발자들에게 필요한 모든 기능을 제공합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    질문 공유
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    답변 공유
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                    <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    회사별 정보
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
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
        <section className="bg-blue-600 dark:bg-blue-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              지금 시작해보세요
            </h2>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              면접 질문을 공유하고, 다른 개발자들과 함께 성장하세요. <br/>
              무료로 시작할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth">
                  무료로 시작하기
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/questions">
                  질문 둘러보기
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}