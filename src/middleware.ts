import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// 미들웨어(Edge)는 pg 드라이버를 못 쓰므로 쿠키 존재만 확인하는 낙관적 체크만 한다.
// 실제 세션 검증(+ role 체크)은 app/admin/layout.tsx(Node 런타임)에서 수행한다.
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
