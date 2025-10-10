"use client";

import { Bookmark, Building2, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth";

const navigation = [
  {
    name: "면접 질문",
    href: "/interview",
    icon: MessageSquare,
    role: ["basic", "admin"],
  },
  {
    name: "즐겨찾기",
    href: "/bookmark",
    icon: Bookmark,
    role: ["basic", "admin"],
  },
  {
    name: "내 그룹",
    href: "/group",
    icon: Users,
    role: ["basic", "admin"],
  },
  {
    name: "회사 관리",
    href: "/admin/company",
    icon: Building2,
    role: ["admin"],
  },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const canAccess = (roles: string[]) => {
    // 로그인하지 않았어도 basic 권한 메뉴는 보이게 함
    if (!user) return roles.includes("basic");
    return roles.includes(user.role || "basic");
  };

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            BumaView
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              if (!canAccess(item.role)) return null;

              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-muted-foreground">{user.id}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                aria-label="로그아웃"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
