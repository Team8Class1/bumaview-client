import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Building, 
  Users, 
  MessageSquare, 
  Star, 
  History, 
  Settings,
  TrendingUp,
  Filter,
  Tag,
  User,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "질문 탐색",
    href: "/questions",
    icon: BookOpen,
    badge: "1.2k",
    children: [
      { label: "전체 질문", href: "/questions", icon: BookOpen },
      { label: "최신 질문", href: "/questions?sort=recent", icon: Clock },
      { label: "인기 질문", href: "/questions?sort=popular", icon: TrendingUp },
      { label: "내 질문", href: "/questions/my", icon: User },
    ]
  },
  {
    label: "회사 정보",
    href: "/companies",
    icon: Building,
    badge: "120+",
    children: [
      { label: "전체 회사", href: "/companies", icon: Building },
      { label: "대기업", href: "/companies?type=large", icon: Building },
      { label: "스타트업", href: "/companies?type=startup", icon: Building },
      { label: "외국계", href: "/companies?type=foreign", icon: Building },
    ]
  },
  {
    label: "그룹",
    href: "/groups",
    icon: Users,
    children: [
      { label: "내 그룹", href: "/groups/my", icon: Users },
      { label: "공개 그룹", href: "/groups/public", icon: Users },
      { label: "그룹 만들기", href: "/groups/create", icon: Plus },
    ]
  },
  {
    label: "답변 모음",
    href: "/answers",
    icon: MessageSquare,
    badge: "3.4k",
    children: [
      { label: "전체 답변", href: "/answers", icon: MessageSquare },
      { label: "내 답변", href: "/answers/my", icon: MessageSquare },
      { label: "좋아요한 답변", href: "/answers/liked", icon: Star },
    ]
  }
];

const quickLinks = [
  { label: "북마크", href: "/bookmarks", icon: Star },
  { label: "최근 본 질문", href: "/recent", icon: History },
  { label: "태그", href: "/tags", icon: Tag },
];

export default function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isLoggedIn] = useState(false);

  useEffect(() => {
    // Auto-expand current menu section
    const currentSection = menuItems.find(item => pathname.startsWith(item.href));
    if (currentSection && !expandedItems.includes(currentSection.label)) {
      setExpandedItems(prev => [...prev, currentSection.label]);
    }
  }, [pathname, expandedItems]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 z-50",
          "lg:translate-x-0 lg:sticky lg:top-16",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Quick Actions */}
          {isLoggedIn && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <Button className="w-full flex items-center space-x-2" asChild>
                <Link href="/questions/create">
                  <Plus className="h-4 w-4" />
                  <span>질문 등록하기</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedItems.includes(item.label);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.label}>
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        isActive(item.href)
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={() => hasChildren ? toggleExpanded(item.label) : null}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {hasChildren && (
                        <div className="ml-auto">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submenu */}
                    {hasChildren && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                              )}
                              onClick={onClose}
                            >
                              <ChildIcon className="h-4 w-4" />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Links */}
            {isLoggedIn && (
              <div className="mt-6 px-4">
                <h4 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  빠른 링크
                </h4>
                <div className="space-y-1">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive(link.href)
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={onClose}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trending Tags */}
            <div className="mt-6 px-4">
              <h4 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                인기 태그
              </h4>
              <div className="px-3 space-y-2">
                {["JavaScript", "React", "Node.js", "Python", "알고리즘"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="inline-block"
                    onClick={onClose}
                  >
                    <Badge variant="outline" className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/25 transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            {isLoggedIn && (
              <Link
                href="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={onClose}
              >
                <Settings className="h-4 w-4" />
                <span>설정</span>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onToggle }: { onToggle: () => void; isOpen?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="lg:hidden fixed top-20 left-4 z-40"
    >
      <Filter className="h-4 w-4" />
    </Button>
  );
}