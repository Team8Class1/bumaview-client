import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_TOKEN = "access_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN);
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isPublicPage = pathname === "/" || isAuthPage;

  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
