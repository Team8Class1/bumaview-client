"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              BumaView
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/questions" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              질문 목록
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <User className="h-4 w-4" />
                  <span>내 프로필</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setIsLoggedIn(false)}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth">
                    로그인
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">
                    회원가입
                  </Link>
                </Button>
              </div>
            )}
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              <Link 
                href="/questions" 
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                질문 목록
              </Link>
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    내 프로필
                  </Link>
                  <div className="px-3 py-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      로그아웃
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/auth">
                      로그인
                    </Link>
                  </Button>
                  <Button 
                    className="w-full"
                    asChild
                  >
                    <Link href="/auth">
                      회원가입
                    </Link>
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