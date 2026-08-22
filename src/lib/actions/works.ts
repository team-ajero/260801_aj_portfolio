"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { works } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

export async function getWorks() {
  return db.select().from(works).orderBy(asc(works.order), asc(works.id));
}

export interface WorkInput {
  title: string;
  category: string;
  area: string;
  year: string;
  imageUrl: string;
  order: number;
}

export async function createWork(input: WorkInput) {
  await requireSession();
  await db.insert(works).values(input);
  revalidatePath("/admin/works");
  revalidatePath("/works");
  revalidatePath("/"); // 홈 시공사례 티저도 같은 테이블을 보여주므로 함께 갱신
}

export async function updateWork(id: number, input: WorkInput) {
  await requireSession();
  await db.update(works).set(input).where(eq(works.id, id));
  revalidatePath("/admin/works");
  revalidatePath("/works");
  revalidatePath("/"); // 홈 시공사례 티저도 같은 테이블을 보여주므로 함께 갱신
}

export async function deleteWork(id: number) {
  await requireSession();
  await db.delete(works).where(eq(works.id, id));
  revalidatePath("/admin/works");
  revalidatePath("/works");
  revalidatePath("/"); // 홈 시공사례 티저도 같은 테이블을 보여주므로 함께 갱신
}
