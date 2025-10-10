import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_TOKEN = "access_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN);
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // 토큰이 있고 로그인/회원가입 페이지에 접근하면 홈으로 리다이렉트
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 토큰이 없어도 모든 페이지 접근 허용 (백엔드 연결 전이므로)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
