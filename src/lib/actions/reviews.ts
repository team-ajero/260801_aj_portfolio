"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reviews, type ReviewStatus } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

/** 프론트 공개 페이지 - 승인(published)된 리뷰만 노출 */
export async function getPublishedReviews() {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.status, "published"))
    .orderBy(desc(reviews.createdAt));
}

/** 관리자 - 전체 리뷰 조회 (대기 포함) */
export async function getAllReviews() {
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export interface ReviewSubmission {
  name: string;
  category: string;
  area: string;
  rating: number;
  content: string;
}

/** 고객이 사이트에서 직접 제출 - 비로그인, 승인 전까지는 pending 상태 */
export async function submitReview(input: ReviewSubmission) {
  if (!input.name.trim() || !input.content.trim()) {
    throw new Error("이름과 후기 내용을 입력해주세요.");
  }
  if (input.rating < 1 || input.rating > 5) {
    throw new Error("평점은 1~5 사이여야 해요.");
  }

  await db.insert(reviews).values({
    name: input.name.trim(),
    category: input.category,
    area: input.area,
    rating: input.rating,
    content: input.content.trim(),
    status: "pending",
  });

  revalidatePath("/admin/reviews");
}

export async function updateReviewStatus(id: number, status: ReviewStatus) {
  await requireSession();
  await db.update(reviews).set({ status }).where(eq(reviews.id, id));
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export interface ReviewEditInput {
  name: string;
  category: string;
  area: string;
  rating: number;
  content: string;
}

export async function updateReview(id: number, input: ReviewEditInput) {
  await requireSession();
  await db.update(reviews).set(input).where(eq(reviews.id, id));
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function deleteReview(id: number) {
  await requireSession();
  await db.delete(reviews).where(eq(reviews.id, id));
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}
