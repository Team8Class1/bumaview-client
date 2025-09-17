"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from "@/types/company";
import { ExternalLink, Building, TrendingUp, Search, Filter, Star } from "lucide-react";
import Link from "next/link";

interface CompanyWithStats extends Company {
  questionCount: number;
  answerCount: number;
  avgSalary?: string;
  employeeCount?: string;
  foundedYear?: number;
  tags: string[];
  rating: number;
  interviewDifficulty: "쉬움" | "보통" | "어려움";
  logo?: string;
}

const mockCompanies: CompanyWithStats[] = [
  {
    id: "1",
    name: "카카오",
    description: "모바일 메신저 및 플랫폼 서비스를 제공하는 글로벌 IT 기업",
    website: "https://www.kakaocorp.com",
    industry: "IT/소프트웨어",
    size: "대기업",
    questionCount: 45,
    answerCount: 128,
    avgSalary: "7,000만원",
    employeeCount: "3,000명",
    foundedYear: 2010,
    tags: ["Frontend", "Backend", "Mobile", "AI"],
    rating: 4.2,
    interviewDifficulty: "어려움",
    logo: "🟡"
  },
  {
    id: "2",
    name: "네이버",
    description: "검색 포털 및 IT 플랫폼 서비스를 제공하는 대한민국 대표 기업",
    website: "https://www.navercorp.com",
    industry: "IT/소프트웨어",
    size: "대기업",
    questionCount: 38,
    answerCount: 95,
    avgSalary: "7,500만원",
    employeeCount: "3,500명",
    foundedYear: 1999,
    tags: ["Search", "Cloud", "AI", "Mobile"],
    rating: 4.1,
    interviewDifficulty: "어려움",
    logo: "🟢"
  },
  {
    id: "3",
    name: "토스",
    description: "간편송금 및 디지털 금융 서비스를 제공하는 핀테크 기업",
    website: "https://toss.im",
    industry: "핀테크",
    size: "중견기업",
    questionCount: 32,
    answerCount: 78,
    avgSalary: "8,000만원",
    employeeCount: "1,500명",
    foundedYear: 2013,
    tags: ["FinTech", "Mobile", "Backend", "DevOps"],
    rating: 4.5,
    interviewDifficulty: "어려움",
    logo: "🔵"
  },
  {
    id: "4",
    name: "마이다스IT",
    description: "구조해석 소프트웨어 및 IT 솔루션을 제공하는 전문 기업",
    website: "https://www.midasit.com",
    industry: "IT/소프트웨어",
    size: "중견기업",
    questionCount: 16,
    answerCount: 34,
    avgSalary: "5,500만원",
    employeeCount: "800명",
    foundedYear: 1989,
    tags: ["CAD/CAE", "Backend", "Desktop"],
    rating: 3.8,
    interviewDifficulty: "보통",
    logo: "🔶"
  },
  {
    id: "5",
    name: "신한은행",
    description: "대한민국 대표 상업은행으로 디지털 금융 서비스를 선도",
    website: "https://www.shinhan.com",
    industry: "금융",
    size: "대기업",
    questionCount: 22,
    answerCount: 56,
    avgSalary: "6,000만원",
    employeeCount: "20,000명",
    foundedYear: 1982,
    tags: ["Banking", "Digital", "Backend", "Security"],
    rating: 3.9,
    interviewDifficulty: "보통",
    logo: "🏦"
  },
  {
    id: "6",
    name: "삼성전자",
    description: "글로벌 전자기기 및 반도체 제조 선도 기업",
    website: "https://www.samsung.com",
    industry: "전자/반도체",
    size: "대기업",
    questionCount: 67,
    answerCount: 189,
    avgSalary: "8,500만원",
    employeeCount: "100,000명",
    foundedYear: 1969,
    tags: ["Hardware", "Mobile", "IoT", "AI"],
    rating: 4.0,
    interviewDifficulty: "어려움",
    logo: "📱"
  },
  {
    id: "7",
    name: "현대자동차",
    description: "글로벌 자동차 제조업체로 미래 모빌리티를 선도",
    website: "https://www.hyundai.com",
    industry: "자동차",
    size: "대기업",
    questionCount: 29,
    answerCount: 71,
    avgSalary: "7,200만원",
    employeeCount: "70,000명",
    foundedYear: 1967,
    tags: ["Automotive", "IoT", "Embedded", "AI"],
    rating: 3.7,
    interviewDifficulty: "보통",
    logo: "🚗"
  },
  {
    id: "8",
    name: "쿠팡",
    description: "이커머스 및 로지스틱스 혁신을 선도하는 글로벌 기업",
    website: "https://www.coupang.com",
    industry: "이커머스",
    size: "대기업",
    questionCount: 41,
    answerCount: 102,
    avgSalary: "9,000만원",
    employeeCount: "5,000명",
    foundedYear: 2010,
    tags: ["E-commerce", "Backend", "DevOps", "Data"],
    rating: 4.3,
    interviewDifficulty: "어려움",
    logo: "📦"
  }
];

export default function CompaniesPage() {
  const [companies] = useState<CompanyWithStats[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("questions");
  const [showFilters, setShowFilters] = useState(false);

  const industries = ["IT/소프트웨어", "핀테크", "금융", "전자/반도체", "자동차", "이커머스"];
  const sizes = ["스타트업", "중견기업", "대기업"];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesSize = !selectedSize || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "questions":
        return b.questionCount - a.questionCount;
      case "rating":
        return b.rating - a.rating;
      case "salary":
        return parseInt(b.avgSalary?.replace(/[^0-9]/g, "") || "0") - parseInt(a.avgSalary?.replace(/[^0-9]/g, "") || "0");
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움": return "bg-green-100 text-green-800";
      case "보통": return "bg-yellow-100 text-yellow-800";
      case "어려움": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              회사 정보
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              각 회사의 면접 정보와 문화를 확인하세요
            </p>
          </div>
          <Button asChild>
            <Link href="/companies/add" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>회사 추가</span>
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="회사명이나 기술 스택으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>필터</span>
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="questions">질문 많은 순</SelectItem>
                  <SelectItem value="rating">평점 높은 순</SelectItem>
                  <SelectItem value="salary">연봉 높은 순</SelectItem>
                  <SelectItem value="name">이름 순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">업종</label>
                  <Select value={selectedIndustry} onValueChange={(value) => setSelectedIndustry(value === 'all' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">기업 규모</label>
                  <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value === 'all' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {sizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{company.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{company.industry}</Badge>
                        <Badge variant="secondary" className="text-xs">{company.size}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {company.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">면접 난이도</span>
                    <Badge className={getDifficultyColor(company.interviewDifficulty)}>
                      {company.interviewDifficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">평점</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{company.rating}</span>
                    </div>
                  </div>

                  {company.avgSalary && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">평균 연봉</span>
                      <span className="font-medium">{company.avgSalary}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">임직원 수</span>
                    <span>{company.employeeCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">설립년도</span>
                    <span>{company.foundedYear}년</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{company.questionCount}개 질문</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{company.answerCount}개 답변</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {company.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {company.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/companies/${company.id}`}>상세 정보</Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1">
                      <Link href={`/companies/${company.id}/questions`}>면접 질문</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCompanies.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              다른 키워드로 검색해보거나 새 회사를 추가해보세요
            </p>
            <Button asChild variant="outline">
              <Link href="/companies/add">회사 추가하기</Link>
            </Button>
          </div>
        )}

        {/* 인기 회사 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            이번 주 인기 회사
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedCompanies.slice(0, 4).map((company) => (
              <Card key={`popular-${company.id}`} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl mb-2">{company.logo}</div>
                  <h3 className="font-semibold mb-1">{company.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{company.industry}</p>
                  <div className="flex items-center justify-center space-x-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{company.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}