import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const companies = [
  {
    name: "마이다스IT",
    description: "IT 서비스 및 솔루션 제공 전문 기업",
    questionCount: 16,
    apiLink: "https://www.midasit.com"
  },
  {
    name: "신한은행",
    description: "대한민국 대표 상업은행",
    questionCount: 8,
    apiLink: "https://www.shinhan.com"
  }
];

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          회사 정보
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {company.name}
                  <Button variant="ghost" size="sm" asChild>
                    <a href={company.apiLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {company.description}
                </p>
                <div className="text-sm text-gray-500">
                  등록된 면접 질문: {company.questionCount}개
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}