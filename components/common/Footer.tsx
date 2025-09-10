import Link from "next/link";
import { Github, Mail, MessageCircle, BookOpen, HelpCircle, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "플랫폼",
    links: [
      { label: "질문 탐색", href: "/questions", icon: BookOpen },
      { label: "회사 정보", href: "/companies", icon: null },
      { label: "그룹", href: "/groups", icon: null },
      { label: "답변 모음", href: "/answers", icon: null },
    ]
  },
  {
    title: "커뮤니티",
    links: [
      { label: "사용자", href: "/users", icon: null },
      { label: "태그", href: "/tags", icon: null },
      { label: "랭킹", href: "/rankings", icon: null },
      { label: "토론", href: "/discussions", icon: null },
    ]
  },
  {
    title: "지원",
    links: [
      { label: "도움말", href: "/help", icon: HelpCircle },
      { label: "가이드라인", href: "/guidelines", icon: null },
      { label: "FAQ", href: "/faq", icon: null },
      { label: "문의하기", href: "/contact", icon: Mail },
    ]
  }
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Discord", href: "https://discord.gg", icon: MessageCircle },
  { label: "이메일", href: "mailto:contact@bumaview.com", icon: Mail },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              BumaView
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
              실제 면접에서 받은 질문들을 공유하고, 다른 개발자들과 함께 답변을 준비하세요. 
              함께 성장하는 개발 문화를 만들어갑니다.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400" />}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="max-w-md">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                최신 소식 받아보기
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                새로운 기능과 유용한 면접 팁을 이메일로 받아보세요.
              </p>
            </div>
            
            <div className="flex w-full lg:w-auto max-w-sm space-x-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm">구독</Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {currentYear} BumaView. 모든 권리 보유.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
              <Link 
                href="/privacy"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Shield className="h-4 w-4 mr-1" />
                개인정보처리방침
              </Link>
              <Link 
                href="/terms"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                이용약관
              </Link>
              <Link 
                href="/sitemap"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                사이트맵
              </Link>
            </div>
          </div>
          
          {/* Version Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              버전 1.0.0 | 마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}