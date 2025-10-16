import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_TOKEN = "access_token";

export function middleware(request: NextRequest) {
  // 여러 가능한 쿠키 이름 확인
  const token =
    request.cookies.get(ACCESS_TOKEN) ||
    request.cookies.get("accessToken") ||
    request.cookies.get("token") ||
    request.cookies.get("auth_token") ||
    request.cookies.get("jwt") ||
    request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // 디버깅: 모든 쿠키와 경로 로그
  console.log("🔍 Middleware - pathname:", pathname);
  console.log("🔍 Middleware - all cookies:", request.cookies.getAll());
  console.log("🔍 Middleware - access_token cookie:", token);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminPage = pathname.startsWith("/admin");

  // 토큰이 있고 로그인/회원가입 페이지에 접근하면 홈으로 리다이렉트
  // 임시로 비활성화하여 문제 확인
  // if (token && isAuthPage) {
  //   console.log("🚨 Middleware - Already logged in, redirecting to home from:", pathname);
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  if (isAuthPage) {
    console.log("✅ Middleware - Allowing access to auth page:", pathname);
  }

  // 어드민 페이지에 토큰 없이 접근하면 로그인 페이지로 리다이렉트
  // 임시로 비활성화하여 문제 확인
  // if (isAdminPage && !token) {
  //   console.log("🚨 Middleware - Admin page access denied, redirecting to login");
  //   console.log("🚨 Middleware - token found:", !!token);
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
