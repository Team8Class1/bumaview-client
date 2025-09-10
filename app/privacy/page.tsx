import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          개인정보처리방침
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 prose dark:prose-invert max-w-none">
          <h2>1. 개인정보의 처리 목적</h2>
          <p>BumaView(&ldquo;회사&rdquo;)는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
          <p>- 서비스 제공 및 운영</p>
          <p>- 회원 관리</p>
          <p>- 서비스 개선 및 신규 서비스 개발</p>
          
          <h2>2. 처리하는 개인정보의 항목</h2>
          <p>필수항목:</p>
          <p>- 이메일 주소</p>
          <p>- 비밀번호</p>
          <p>- 이름</p>
          
          <p>선택항목:</p>
          <p>- 자기소개</p>
          <p>- 관심 분야</p>
          <p>- GitHub 계정</p>
          
          <h2>3. 개인정보의 보유 및 이용기간</h2>
          <p>회사는 이용자가 서비스를 이용하는 동안 개인정보를 보유합니다. 이용자가 회원탈퇴를 요청하는 경우, 지체 없이 개인정보를 파기합니다.</p>
          
          <h2>4. 개인정보의 제3자 제공</h2>
          <p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</p>
          
          <h2>5. 정보주체의 권리</h2>
          <p>이용자는 언제든지 자신의 개인정보 처리에 대한 다음의 권리를 가집니다:</p>
          <p>- 개인정보 열람·정정·삭제 요구</p>
          <p>- 개인정보 처리중단 요구</p>
          
          <p className="text-sm text-gray-500 mt-8">
            본 방침은 2024년 1월 1일부터 시행됩니다.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}