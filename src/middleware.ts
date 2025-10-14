import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_TOKEN = "access_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN);
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminPage = pathname.startsWith("/admin");

  // 토큰이 있고 로그인/회원가입 페이지에 접근하면 홈으로 리다이렉트
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 어드민 페이지에 토큰 없이 접근하면 로그인 페이지로 리다이렉트
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
