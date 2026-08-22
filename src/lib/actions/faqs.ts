"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

export async function getFaqs() {
  return db.select().from(faqs).orderBy(asc(faqs.order), asc(faqs.id));
}

export interface FaqInput {
  category: string;
  question: string;
  answer: string;
  order: number;
}

export async function createFaq(input: FaqInput) {
  await requireSession();
  await db.insert(faqs).values(input);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function updateFaq(id: number, input: FaqInput) {
  await requireSession();
  await db.update(faqs).set(input).where(eq(faqs.id, id));
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function deleteFaq(id: number) {
  await requireSession();
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
