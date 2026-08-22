"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inquiries, type InquiryStatus } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

export async function getInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export interface InquirySubmission {
  name: string;
  phone: string;
  email?: string;
  type?: string;
  area?: string;
  message?: string;
}

/** 견적 문의 폼 제출 - 비로그인 공개 액션 */
export async function submitInquiry(input: InquirySubmission) {
  if (!input.name.trim() || !input.phone.trim()) {
    throw new Error("이름과 연락처는 필수 입력 항목이에요.");
  }

  await db.insert(inquiries).values({
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    type: input.type || null,
    area: input.area?.trim() || null,
    message: input.message?.trim() || null,
    status: "new",
  });

  revalidatePath("/admin/inquiries");
}

export async function updateInquiryStatus(id: number, status: InquiryStatus) {
  await requireSession();
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id: number) {
  await requireSession();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
}
