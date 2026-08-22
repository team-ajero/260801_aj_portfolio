import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * 콘텐츠 테이블 (관리자에서 CRUD하는 실제 서비스 데이터)
 * Better Auth가 생성하는 인증 테이블(user/session/account/verification)은
 * `lib/db/auth-schema.ts`에 별도로 두고 여기서는 re-export만 한다.
 * (CLI로 재생성해도 이 파일의 콘텐츠 테이블 정의가 덮어써지지 않도록 분리)
 */
export * from "./auth-schema";

// ---------- 메인 페이지 히어로 ----------

// 히어로 배경 캐러셀 이미지
export const heroSlides = pgTable("hero_slides", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  imageUrl: text("image_url").notNull(),
  focus: text("focus").notNull().default("center"), // object-position 값 (예: "center 35%")
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 히어로 텍스트 (싱글턴 - 항상 1행만 존재)
export const heroContent = pgTable("hero_content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  eyebrow: text("eyebrow").notNull().default("Interior Design Studio"),
  headline: text("headline").notNull(), // 예: "공간이 말하는 당신의 이야기"
  description: text("description").notNull(),
  primaryCtaLabel: text("primary_cta_label").notNull().default("시공사례 보기"),
  primaryCtaHref: text("primary_cta_href").notNull().default("/works"),
  secondaryCtaLabel: text("secondary_cta_label").notNull().default("견적 문의"),
  secondaryCtaHref: text("secondary_cta_href").notNull().default("/contact"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- 서비스 소개 ----------

export const services = pgTable("services", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  details: text("details").array().notNull().default([]), // 서비스 상세 항목 리스트
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- 회사소개 ----------

// 스토리 + 통계 (싱글턴 - 항상 1행만 존재)
export const aboutContent = pgTable("about_content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  eyebrow: text("eyebrow").notNull().default("Our Story"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  imageUrl: text("image_url").notNull(),
  stats: jsonb("stats")
    .$type<{ number: string; label: string }[]>()
    .notNull()
    .default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  imageUrl: text("image_url"), // 없으면 프론트에서 AvatarPlaceholder로 대체
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const companyHistory = pgTable("company_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  year: text("year").notNull(),
  event: text("event").notNull(),
  order: integer("order").notNull().default(0),
});

// ---------- 포트폴리오(시공사례) ----------

export const works = pgTable("works", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 아파트 | 주택 | 상업공간
  area: text("area").notNull(),
  year: text("year").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- FAQ ----------

export const faqs = pgTable("faqs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- 고객 리뷰 ----------
// 고객이 사이트에서 직접 작성 -> 스팸 방지를 위해 관리자 승인 후 노출(status)
export const reviewStatusValues = ["pending", "published"] as const;
export type ReviewStatus = (typeof reviewStatusValues)[number];

export const reviews = pgTable("reviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  area: text("area").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"), // pending | published
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- 견적 문의 ----------
export const inquiryStatusValues = ["new", "in_progress", "done"] as const;
export type InquiryStatus = (typeof inquiryStatusValues)[number];

export const inquiries = pgTable("inquiries", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  type: text("type"), // 시공 종류
  area: text("area"), // 평수
  message: text("message"),
  status: text("status").notNull().default("new"), // new | in_progress | done
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
