import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Server Action / Route Handler에서 사용하는 인증 가드.
 * 미들웨어는 쿠키 존재만 낙관적으로 확인하므로, 실제 mutation 전에는
 * 반드시 이 함수로 세션을 다시 검증한다.
 */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("로그인이 필요합니다.");
  }
  return session;
}

/** 관리자(admin) role만 허용 - 계정/직원 관리 등 민감한 동작에 사용 */
export async function requireAdminRole() {
  const session = await requireSession();
  if (session.user.role !== "admin") {
    throw new Error("권한이 없습니다.");
  }
  return session;
}
