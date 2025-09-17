"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { User, Menu, X, Plus, Bookmark, Users, Building, Settings } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState<User | null>(null);

  const navigationItems = [
    { href: "/questions", label: "질문 탐색", icon: null },
    { href: "/companies", label: "회사 정보", icon: Building },
    { href: "/groups", label: "그룹", icon: Users },
  ];

  const userMenuItems = isLoggedIn ? [
    { href: "/profile", label: "내 프로필", icon: User },
    { href: "/questions/create", label: "질문 등록", icon: Plus },
    { href: "/groups", label: "내 그룹", icon: Users },
    { href: "/bookmarks", label: "북마크", icon: Bookmark },
    ...(user?.role === 'admin' ? [{ href: "/admin", label: "관리자", icon: Settings }] : []),
  ] : [];


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-foreground hover:text-blue-500 transition-colors">
              BumaView
            </Link>
            
            {/* Desktop Search Bar */}
            <div className="hidden lg:block ml-8">
              <SearchBar className="w-80" placeholder="질문, 회사, 키워드 검색..." />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="default" asChild>
                  <Link href="/questions/create" className="flex items-center space-x-1">
                    <Plus className="h-4 w-4" />
                    <span>질문 등록</span>
                  </Link>
                </Button>
                
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:block">{user?.name || '사용자'}</span>
                  </Button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                      <hr className="my-2 border-border" />
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                      >
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth">로그인</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">회원가입</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <SearchBar className="w-full" placeholder="질문, 회사, 키워드 검색..." />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {isLoggedIn ? (
                <>
                  <hr className="my-2 border-border" />
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth">로그인</Link>
                  </Button>
                  <Button 
                    className="w-full"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth">회원가입</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}