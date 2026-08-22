import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  // 로컬 개발 중 3000번 포트가 다른 프로세스에 막혀 next dev가 다른 포트로 뜨는 경우가 있어
  // (Better Auth는 요청 Origin이 baseURL과 다르면 무조건 거부함) 흔한 로컬 포트를 함께 허용해둔다.
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
  emailAndPassword: {
    enabled: true,
    // 관리자 계정은 초대/시드로만 생성 - 공개 회원가입 폼은 없음
    disableSignUp: true,
  },
  plugins: [
    // role은 admin 플러그인 기본값(user/admin)을 그대로 사용.
    // "user" = 일반 직원(콘텐츠 관리만), "admin" = 계정 관리까지 가능한 관리자
    admin({
      adminRoles: ["admin"],
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
