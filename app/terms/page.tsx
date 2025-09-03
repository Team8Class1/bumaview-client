import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          이용약관
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 prose dark:prose-invert max-w-none">
          <h2>제1조 (목적)</h2>
          <p>이 약관은 BumaView("회사")가 제공하는 면접 질문 공유 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
          
          <h2>제2조 (정의)</h2>
          <p>1. "서비스"라 함은 회사가 제공하는 면접 질문 공유 플랫폼을 의미합니다.</p>
          <p>2. "이용자"라 함은 본 약관에 따라 회사가 제공하는 서비스를 받는 회원을 말합니다.</p>
          
          <h2>제3조 (서비스의 제공)</h2>
          <p>1. 면접 질문 등록 및 검색</p>
          <p>2. 답변 작성 및 공유</p>
          <p>3. 커뮤니티 기능</p>
          
          <h2>제4조 (이용자의 의무)</h2>
          <p>이용자는 다음 행위를 하여서는 안됩니다:</p>
          <p>1. 허위 정보 입력</p>
          <p>2. 타인의 개인정보 도용</p>
          <p>3. 서비스의 안정적 운영을 방해하는 행위</p>
          
          <p className="text-sm text-gray-500 mt-8">
            본 약관은 2024년 1월 1일부터 시행됩니다.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}