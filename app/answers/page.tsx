import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function AnswersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          공개 답변 목록
        </h1>
        
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            답변 기능은 곧 출시될 예정입니다.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}